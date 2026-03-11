import { Router } from 'express';
import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import Subscription from '../models/Subscription.js';
import { authenticate } from '../middleware/auth.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendNotification } from '../utils/notifications.js';
import Vendor from '../models/Vendor.js';
import User from '../models/User.js';

const router = Router();

// Load env explicitly
try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    dotenv.config({ path: path.join(__dirname, '../../.env') });
} catch (e) { }

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('⚠️ STRIPE_SECRET_KEY is missing from .env!');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_dummy', {
    apiVersion: '2023-10-16',
});

// ─────────────────────────────────────────────────────────────────────────────
// Helper to fulfill a session (used by both webhook and manual confirmation)
// ─────────────────────────────────────────────────────────────────────────────
async function fulfillSession(sessionId) {
    console.log(`🔍 Fulfilling session: ${sessionId}`);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
        console.warn(`⚠️ Session ${sessionId} not paid yet (status: ${session.payment_status})`);
        return null;
    }

    const metadata = session.metadata || {};
    const paymentIntentId = session.payment_intent;

    if (metadata.type === 'subscription') {
        // 1. Check if subscription already exists to avoid duplicates
        let sub = await Subscription.findOne({ stripeSessionId: session.id });
        if (!sub) {
            console.log('📝 Creating new subscription from session...');
            const totalPlanDays = metadata.plan_type === 'weekly' ? 7 : (metadata.plan_type === 'biweekly' ? 14 : 30);
            const startDate = new Date(metadata.deliveryDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + totalPlanDays - 1);

            sub = await Subscription.create({
                user_id: metadata.userId,
                vendor_id: metadata.vendorId,
                menu_id: metadata.mealId || null,
                plan_type: metadata.plan_type,
                meal_type: metadata.meal_type,
                amount: Number(metadata.price),
                start_date: metadata.deliveryDate,
                end_date: endDate.toISOString().split('T')[0],
                total_plan_days: totalPlanDays,
                delivered_count: 0,
                remaining_days: totalPlanDays,
                lunch_time: metadata.lunch_time || '12:30',
                dinner_time: metadata.dinner_time || '19:30',
                delivery_address_id: metadata.delivery_address_id || null,
                stripeSessionId: session.id,
                paymentIntentId: paymentIntentId,
            });

            // SPECIAL CASE FOR SUBSCRIPTIONS:
            // If this is a subscription payment, we do NOT create any orders yet.
            // The vendor will see the user in their "Active Subscriptions" panel and
            // manual order records will be created only when "Send Today's Tiffin" is clicked.
            const isSubscription = metadata.type === 'subscription';
            const existingOrdersCount = await Order.countDocuments({ stripeSessionId: session.id });

            if (!isSubscription && existingOrdersCount === 0) {
                let ordersToInsert = [];
                if (metadata.auto_orders) {
                    try {
                        const parsedOrders = JSON.parse(metadata.auto_orders);
                        ordersToInsert = parsedOrders.map((o) => ({
                            ...o,
                            userId: metadata.userId,
                            paymentId: paymentIntentId,
                            stripeSessionId: session.id,
                            paymentStatus: 'paid',
                            orderStatus: 'pending',
                        }));
                    } catch (e) {
                        console.error('❌ Failed to parse auto_orders metadata:', e.message);
                    }
                }

                if (ordersToInsert.length > 0) {
                    await Order.insertMany(ordersToInsert);
                    console.log(`✅ Created ${ordersToInsert.length} one-time orders.`);
                }
            } else if (isSubscription) {
                console.log('✅ Subscription flow: Skipping auto-order creation. Use Vendor Panel to log first delivery.');
            }

            // Create Payment record
            const payExists = await Payment.findOne({ stripeSessionId: session.id });
            if (!payExists) {
                await Payment.create({
                    user_id: metadata.userId,
                    subscription_id: sub._id,
                    stripeSessionId: session.id,
                    paymentIntentId: paymentIntentId,
                    amount: Number(metadata.price),
                    currency: session.currency || 'inr',
                    status: 'captured',
                    paymentMethod: 'stripe'
                });
            }
        }

        // --- BROADCAST NOTIFICATIONS FOR SUBSCRIPTION ---
        if (sub) {
            // 1. Notify Customer
            await sendNotification(metadata.userId, {
                title: 'Subscription Active!',
                message: `Your ${metadata.plan_type} subscription for ${metadata.meal_type} has been activated.`,
                type: 'subscription',
                role: 'user',
                link: '/dashboard/subscription'
            });

            // 2. Notify Vendor
            const vendor = await Vendor.findById(metadata.vendorId);
            if (vendor && vendor.user_id) {
                await sendNotification(vendor.user_id, {
                    title: 'New Subscriber! 📈',
                    message: `A new customer transitioned to a ${metadata.plan_type} plan.`,
                    type: 'new_order',
                    role: 'vendor',
                    link: '/vendor'
                });
            }

            // 3. Notify Admins
            const admins = await User.find({ role: 'admin' });
            for (const admin of admins) {
                await sendNotification(admin._id, {
                    title: 'System Alert: New Subscription',
                    message: `A ${metadata.plan_type} subscription was purchased by ${metadata.userId}.`,
                    type: 'admin',
                    role: 'admin',
                    link: '/admin'
                });
            }
        }
        return { type: 'subscription', id: sub._id };
    } else {
        // Meal Order Logic
        let order = await Order.findOne({ stripeSessionId: session.id });
        if (!order) {
            console.log('📝 Creating new meal order from session...');
            order = await Order.create({
                userId: metadata.userId,
                vendorId: metadata.vendorId,
                vendorName: metadata.vendorName || 'Home Chef',
                mealId: metadata.mealId,
                mealName: metadata.mealName,
                price: Number(metadata.price),
                deliveryDate: metadata.deliveryDate,
                deliveryTime: metadata.deliveryTime,
                deliveryAddress: metadata.deliveryAddress,
                notes: metadata.notes || null,
                paymentId: paymentIntentId,
                stripeSessionId: session.id,
                paymentStatus: 'paid',
                orderStatus: 'pending',
            });

            // --- BROADCAST NOTIFICATIONS FOR MEAL ORDER ---
            // 1. Notify Customer
            await sendNotification(metadata.userId, {
                title: 'Order Confirmed',
                message: `Payment received for ${metadata.mealName}. Your meal is scheduled for ${metadata.deliveryDate}.`,
                type: 'delivered',
                role: 'user',
                orderId: order._id,
                link: `/dashboard/track/${order._id}`
            });

            // 2. Notify Vendor
            const vendor = await Vendor.findById(metadata.vendorId);
            if (vendor && vendor.user_id) {
                await sendNotification(vendor.user_id, {
                    title: 'New Paid Order! 🍱',
                    message: `Confirmed payment for ${metadata.mealName}. Delivery on ${metadata.deliveryDate}.`,
                    type: 'new_order',
                    role: 'vendor',
                    orderId: order._id,
                    link: '/vendor/orders'
                });
            }

            // 3. Notify Admins
            const admins = await User.find({ role: 'admin' });
            for (const admin of admins) {
                await sendNotification(admin._id, {
                    title: 'Admin Alert: Order Paid',
                    message: `Payment confirmed for ${metadata.mealName} (Order: ${order._id}).`,
                    type: 'admin',
                    role: 'admin',
                    orderId: order._id,
                    link: '/admin/orders'
                });
            }

            const payExists = await Payment.findOne({ stripeSessionId: session.id });
            if (!payExists) {
                await Payment.create({
                    user_id: metadata.userId,
                    order_id: order._id,
                    stripeSessionId: session.id,
                    paymentIntentId: paymentIntentId,
                    amount: Number(metadata.price),
                    currency: session.currency || 'inr',
                    status: 'captured',
                    paymentMethod: 'stripe'
                });
            }
        }
        return { type: 'order', id: order._id };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payments/create-checkout-session
// ─────────────────────────────────────────────────────────────────────────────
router.post('/create-checkout-session', authenticate, async (req, res, next) => {
    try {
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_dummy') {
            throw new Error('Stripe is not configured on the server. Please check environment variables.');
        }

        const payload = req.body;

        if (!payload.amount || Number(payload.amount) <= 0) {
            return res.status(400).json({ message: 'Valid amount is required' });
        }

        const success_url = `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
        const cancel_url = `${process.env.FRONTEND_URL}/payment-cancel`;

        const line_items = [{
            price_data: {
                currency: payload.currency || 'inr',
                product_data: {
                    name: payload.mealName || payload.planName || 'TiffinConnect Meal',
                },
                unit_amount: Math.round(Number(payload.amount) * 100),
            },
            quantity: 1,
        }];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            success_url,
            cancel_url,
            customer_email: req.user.email,
            client_reference_id: req.user.userId,
            metadata: {
                type: payload.type || 'order',
                userId: req.user.userId,
                vendorId: payload.vendorId,
                mealId: payload.mealId || '',
                subscriptionId: payload.subscriptionId || '',
                mealName: payload.mealName || '',
                planName: payload.planName || '',
                price: payload.amount,
                deliveryDate: payload.deliveryDate || '',
                deliveryTime: payload.deliveryTime || '',
                deliveryAddress: payload.deliveryAddress || '',
                notes: payload.notes || '',
                plan_type: payload.plan_type || '',
                meal_type: payload.meal_type || '',
                lunch_time: payload.lunch_time || '',
                dinner_time: payload.dinner_time || '',
                auto_orders: payload.auto_orders ? JSON.stringify(payload.auto_orders) : '',
                delivery_address_id: payload.delivery_address_id || '',
                vendorName: payload.vendorName || ''
            }
        });

        res.json({ sessionUrl: session.url, sessionId: session.id });
    } catch (err) {
        console.error('❌ Stripe create-checkout-session error:', err.message);
        next(err);
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payments/confirm-session
// ─────────────────────────────────────────────────────────────────────────────
router.get('/confirm-session', authenticate, async (req, res, next) => {
    try {
        const { session_id } = req.query;
        if (!session_id) return res.status(400).json({ message: 'session_id is required' });

        const result = await fulfillSession(session_id);
        res.json({ success: true, ...result });
    } catch (err) {
        console.error('❌ Manual confirmation error:', err.message);
        next(err);
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payments/webhook
// ─────────────────────────────────────────────────────────────────────────────
router.post('/webhook', async (req, res, next) => {
    const signature = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        if (!webhookSecret) {
            console.warn('⚠️ STRIPE_WEBHOOK_SECRET missing, bypassing signature verification.');
            event = req.body;
        } else {
            event = stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
        }
    } catch (err) {
        console.error('❌ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        if (event.type === 'checkout.session.completed') {
            await fulfillSession(event.data.object.id);
        }
        res.json({ received: true });
    } catch (err) {
        console.error('❌ Webhook processing failed:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payments — my payment history
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', authenticate, async (req, res, next) => {
    try {
        const payments = await Payment.find({ user_id: req.user.userId }).sort({ createdAt: -1 });
        res.json(payments.map((p) => p.toJSON()));
    } catch (err) {
        next(err);
    }
});

export default router;
