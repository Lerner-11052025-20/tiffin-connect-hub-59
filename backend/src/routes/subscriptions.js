import { Router } from 'express';
import Subscription from '../models/Subscription.js';
import Order from '../models/Order.js';
import Vendor from '../models/Vendor.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { sendNotification } from '../utils/notifications.js';

const router = Router();

function withPopulated(sub) {
    const obj = sub.toJSON ? sub.toJSON() : { ...sub };
    // vendor
    if (sub.vendor_id && typeof sub.vendor_id === 'object') {
        obj.vendors = { business_name: sub.vendor_id.business_name };
        obj.vendor_id = sub.vendor_id._id?.toString() ?? sub.vendor_id.toString();
    }
    // menu
    if (sub.menu_id && typeof sub.menu_id === 'object') {
        obj.menus = { name: sub.menu_id.name, meal_type: sub.menu_id.meal_type, items: sub.menu_id.items };
        obj.menu_id = sub.menu_id._id?.toString() ?? sub.menu_id.toString();
    }
    return obj;
}

// GET /api/subscriptions  — my subscriptions
router.get('/', authenticate, async (req, res, next) => {
    try {
        const subs = await Subscription.find({ user_id: req.user.userId })
            .populate('vendor_id', 'business_name')
            .populate('menu_id', 'name meal_type items')
            .sort({ createdAt: -1 });
        res.json(subs.map(withPopulated));
    } catch (err) {
        next(err);
    }
});

// GET /api/subscriptions/active  — single active subscription
router.get('/active', authenticate, async (req, res, next) => {
    try {
        const sub = await Subscription.findOne({ user_id: req.user.userId, status: 'active' })
            .populate('vendor_id', 'business_name')
            .populate('menu_id', 'name meal_type items');
        if (!sub) return res.json(null);
        res.json(withPopulated(sub));
    } catch (err) {
        next(err);
    }
});

// GET /api/subscriptions/vendor  — subscriptions for my vendor (vendor only)
router.get('/vendor', authenticate, async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ user_id: req.user.userId });
        if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });

        const subs = await Subscription.find({ vendor_id: vendor._id, status: 'active' })
            .populate('menu_id', 'name meal_type items')
            .sort({ createdAt: -1 });

        // Fetch user profiles for subscribers
        const userIds = [...new Set(subs.map((s) => s.user_id.toString()))];
        const users = await User.find({ _id: { $in: userIds } }).select('full_name phone');
        const userMap = new Map(users.map((u) => [u._id.toString(), u]));

        const result = subs.map((sub) => {
            const obj = sub.toJSON();
            if (sub.menu_id && typeof sub.menu_id === 'object') {
                obj.menus = { name: sub.menu_id.name, meal_type: sub.menu_id.meal_type, items: sub.menu_id.items };
                obj.menu_id = sub.menu_id._id?.toString();
            }
            const profile = userMap.get(sub.user_id.toString());
            obj.profiles = profile ? { full_name: profile.full_name, phone: profile.phone } : null;
            return obj;
        });

        res.json(result);
    } catch (err) {
        next(err);
    }
});

// POST /api/subscriptions  — create new subscription + auto-generate orders
router.post('/', authenticate, async (req, res, next) => {
    try {
        const {
            vendor_id, menu_id, plan_type, meal_type, amount,
            start_date, end_date, lunch_time, dinner_time, delivery_address_id,
            auto_orders, // array of order objects to create
        } = req.body;

        const totalPlanDays = plan_type === 'weekly' ? 7 : (plan_type === 'biweekly' ? 14 : 30);
        const startDate = new Date(start_date);
        const endDateObj = new Date(startDate);
        endDateObj.setDate(startDate.getDate() + totalPlanDays - 1);

        const sub = await Subscription.create({
            user_id: req.user.userId,
            vendor_id,
            menu_id: menu_id || null,
            plan_type,
            meal_type,
            amount,
            start_date,
            end_date: end_date || endDateObj.toISOString().split('T')[0],
            total_plan_days: totalPlanDays,
            delivered_count: 0,
            remaining_days: totalPlanDays,
            lunch_time: lunch_time || '12:30',
            dinner_time: dinner_time || '19:30',
            delivery_address_id: delivery_address_id || null,
        });

        // ... existing auto-orders logic ...
        if (auto_orders && Array.isArray(auto_orders) && auto_orders.length > 0) {
            const ordersToInsert = auto_orders.map((o) => ({
                ...o,
                userId: req.user.userId,
                subscriptionId: sub._id,
            }));
            await Order.insertMany(ordersToInsert);
        }

        const populatedSub = await Subscription.findById(sub._id)
            .populate('vendor_id', 'business_name')
            .populate('menu_id', 'name meal_type items');

        res.status(201).json(withPopulated(populatedSub));
    } catch (err) {
        next(err);
    }
});

// Helper to get today/tomorrow in IST
function getTodayDate() {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
}

function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(tomorrow);
}

// PUT /api/subscriptions/:id/deliver — Vendor marks today's tiffin as sent
router.put('/:id/deliver', authenticate, async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ user_id: req.user.userId });
        if (!vendor) return res.status(403).json({ message: 'Only vendors can mark deliveries' });

        const sub = await Subscription.findOne({ _id: req.params.id, vendor_id: vendor._id }).populate('menu_id');
        if (!sub) return res.status(404).json({ message: 'Subscription not found' });

        if (sub.delivered_count >= sub.total_plan_days) {
            return res.status(400).json({ message: 'Subscription already completed' });
        }

        const todayStr = getTodayDate();

        // 1. Check if we already delivered today to prevent duplicates
        const alreadyDelivered = await Order.findOne({
            subscriptionId: sub._id,
            deliveryDate: todayStr,
            orderStatus: 'delivered'
        });

        if (alreadyDelivered) {
            return res.status(400).json({ message: 'Tiffin already sent for today!' });
        }

        const newDeliveredCount = sub.delivered_count + 1;
        const newRemainingDays = sub.total_plan_days - newDeliveredCount;
        const newStatus = newRemainingDays === 0 ? 'completed' : 'active';

        const updatedSub = await Subscription.findByIdAndUpdate(
            sub._id,
            {
                delivered_count: newDeliveredCount,
                remaining_days: newRemainingDays,
                status: newStatus
            },
            { new: true }
        ).populate('menu_id', 'name meal_type items');

        // Calculate proper per-day price
        let perDayPrice = sub.amount / sub.total_plan_days;
        if (!perDayPrice && sub.menu_id?.price) {
            perDayPrice = sub.menu_id.price;
        }

        // 2. Create or Update the order record for TODAY
        try {
            // Find if there's an existing pending placeholder for today
            let todayOrder = await Order.findOne({
                subscriptionId: updatedSub._id,
                deliveryDate: todayStr,
                orderStatus: 'pending'
            });

            const deliveryTime = updatedSub.meal_type === 'both'
                ? `L: ${updatedSub.lunch_time} & D: ${updatedSub.dinner_time}`
                : (updatedSub.meal_type === 'lunch' ? updatedSub.lunch_time : updatedSub.dinner_time);

            const mealNameSuffix = updatedSub.meal_type === 'both' ? ' (Both Meals)' : '';

            if (todayOrder) {
                // Update existing placeholder
                todayOrder.orderStatus = 'delivered';
                todayOrder.price = perDayPrice;
                todayOrder.deliveryTime = deliveryTime;
                todayOrder.mealName = (updatedSub.menu_id?.name || `${updatedSub.plan_type} Plan`) + mealNameSuffix;
                await todayOrder.save();
            } else {
                // Create new delivered record
                await Order.create({
                    userId: updatedSub.user_id,
                    vendorId: vendor._id,
                    vendorName: vendor.business_name,
                    subscriptionId: updatedSub._id,
                    mealId: updatedSub.menu_id?._id || updatedSub.menu_id,
                    mealName: (updatedSub.menu_id?.name || `${updatedSub.plan_type} Plan`) + mealNameSuffix,
                    price: perDayPrice,
                    deliveryDate: todayStr,
                    deliveryTime: deliveryTime,
                    deliveryAddress: updatedSub.delivery_address_id || 'Subscription Address',
                    paymentStatus: 'paid',
                    orderStatus: 'delivered'
                });
            }

            // Cleanup any extra split orders if they existed (e.g. from old logic)
            await Order.deleteMany({
                subscriptionId: updatedSub._id,
                deliveryDate: todayStr,
                _id: { $ne: todayOrder?._id }
            });

        } catch (err) {
            console.error('❌ Failed to log subscription order in history:', err.message);
        }

        // 3. Create the NEXT day's placeholder order
        if (newRemainingDays > 0) {
            try {
                const tomorrowStr = getTomorrowDate();

                // Check if already exists
                const nextExists = await Order.findOne({
                    subscriptionId: updatedSub._id,
                    deliveryDate: tomorrowStr
                });

                if (!nextExists) {
                    const deliveryTime = updatedSub.meal_type === 'both'
                        ? `L: ${updatedSub.lunch_time} & D: ${updatedSub.dinner_time}`
                        : (updatedSub.meal_type === 'lunch' ? updatedSub.lunch_time : updatedSub.dinner_time);

                    const mealNameSuffix = updatedSub.meal_type === 'both' ? ' (Both Meals)' : '';

                    await Order.create({
                        userId: updatedSub.user_id,
                        vendorId: vendor._id,
                        vendorName: vendor.business_name,
                        subscriptionId: updatedSub._id,
                        mealId: updatedSub.menu_id?._id || updatedSub.menu_id,
                        mealName: (updatedSub.menu_id?.name || `${updatedSub.plan_type} Plan`) + mealNameSuffix,
                        price: perDayPrice,
                        deliveryDate: tomorrowStr,
                        deliveryTime: deliveryTime,
                        deliveryAddress: updatedSub.delivery_address_id || 'Subscription Address',
                        paymentStatus: 'paid',
                        orderStatus: 'pending'
                    });
                }
            } catch (err) {
                console.error('❌ Failed to auto-generate next subscription order:', err.message);
            }
        }

        // Fetch user profile
        const user = await User.findById(sub.user_id).select('full_name phone');
        const result = updatedSub.toJSON();
        result.profiles = user ? { full_name: user.full_name, phone: user.phone } : null;

        res.json(result);
    } catch (err) {
        next(err);
    }
});

// GET /api/subscriptions/:id/schedule — fetch all orders tied to subscription for Smart Calendar
router.get('/:id/schedule', authenticate, async (req, res, next) => {
    try {
        const sub = await Subscription.findOne({ _id: req.params.id, user_id: req.user.userId });
        if (!sub) return res.status(404).json({ message: 'Subscription not found' });

        // Retrieve all generated orders (ignoring getVisibilityFilter which hides future deliveries)
        const orders = await Order.find({ subscriptionId: sub._id })
            .populate('vendorId', 'business_name')
            .sort({ deliveryDate: 1 });

        const mapped = orders.map((o) => {
            const obj = o.toJSON();
            if (o.vendorId && typeof o.vendorId === 'object') {
                obj.vendors = { business_name: o.vendorId.business_name };
                obj.vendorId = o.vendorId._id?.toString();
            }
            return obj;
        });

        res.json(mapped);
    } catch (err) {
        next(err);
    }
});

// PUT /api/subscriptions/order/:orderId — update specific meal (skip/pause/modify)
router.put('/order/:orderId', authenticate, async (req, res, next) => {
    try {
        const { status, deliveryTime, notes } = req.body;
        const updateData = {};
        if (status) updateData.orderStatus = status;
        if (deliveryTime) updateData.deliveryTime = deliveryTime;
        if (notes !== undefined) updateData.notes = notes;

        const order = await Order.findOneAndUpdate(
            { _id: req.params.orderId, userId: req.user.userId },
            updateData,
            { new: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order.toJSON());
    } catch (err) {
        next(err);
    }
});

// GET /api/subscriptions/:id  — get single subscription details
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const sub = await Subscription.findOne({ _id: req.params.id, user_id: req.user.userId })
            .populate('vendor_id', 'business_name')
            .populate('menu_id', 'name meal_type items');
        if (!sub) return res.status(404).json({ message: 'Subscription not found' });
        res.json(withPopulated(sub));
    } catch (err) {
        next(err);
    }
});

// POST /api/subscriptions/:id/pause — Toggle Holiday Mode
router.post('/:id/pause', authenticate, async (req, res, next) => {
    try {
        const sub = await Subscription.findOne({ _id: req.params.id, user_id: req.user.userId });
        if (!sub) return res.status(404).json({ message: 'Subscription not found' });

        if (sub.status === 'completed' || sub.status === 'cancelled') {
            return res.status(400).json({ message: 'Cannot pause a completed or cancelled subscription' });
        }

        const isPausing = sub.status === 'active';

        if (isPausing) {
            // PAUSE LOGIC: Just change status and record the pause start date
            sub.status = 'paused';
            // We store the pause start time in a temporary field or just use updatedAt
            // But let's add a explicit field to be safe if needed, or just use current time
            sub.pause_start_date = new Date().toISOString();
        } else if (sub.status === 'paused') {
            // RESUME LOGIC: Calculate days paused and extend end_date
            const pauseStart = new Date(sub.pause_start_date || sub.updatedAt);
            const pauseEnd = new Date();
            const pauseDurationMs = pauseEnd.getTime() - pauseStart.getTime();
            const pauseDurationDays = Math.ceil(pauseDurationMs / (1000 * 60 * 60 * 24));

            if (sub.end_date && pauseDurationDays > 0) {
                const currentEndDate = new Date(sub.end_date);
                currentEndDate.setDate(currentEndDate.getDate() + pauseDurationDays);
                sub.end_date = currentEndDate.toISOString().split('T')[0];
            }

            sub.status = 'active';
            sub.pause_start_date = null;

            // Delete any "Pending" orders that were auto-generated for the pause period if any
            // (Our system now only generates one day ahead, so we might need to update that order's date)
            const nextOrder = await Order.findOne({
                subscriptionId: sub._id,
                orderStatus: 'pending',
                deliveryDate: { $gte: new Date().toISOString().split('T')[0] }
            });

            if (nextOrder) {
                const today = new Date().toISOString().split('T')[0];
                nextOrder.deliveryDate = today; // Bring it to today upon resume
                await nextOrder.save();
            }
        }

        await sub.save();

        // Notify stakeholders about Holiday Mode change
        try {
            const vendor = await Vendor.findById(sub.vendor_id);
            const actionText = sub.status === 'paused' ? 'Paused (Holiday Mode)' : 'Resumed';

            // 1. Notify User
            await sendNotification(sub.user_id, {
                title: `Subscription ${actionText}`,
                message: `Your subscription with ${vendor?.business_name || 'the vendor'} has been ${actionText.toLowerCase()}.`,
                type: sub.status === 'paused' ? 'cancelled' : 'order_confirmed',
                role: 'user',
                link: '/dashboard/subscription'
            });

            // 2. Notify Vendor
            if (vendor && vendor.user_id) {
                await sendNotification(vendor.user_id, {
                    title: `Client Subscription ${actionText}`,
                    message: `A customer has ${actionText.toLowerCase()} their subscription plan.`,
                    type: sub.status === 'paused' ? 'cancelled' : 'new_order',
                    role: 'vendor',
                    link: '/vendor/orders'
                });
            }
        } catch (notifErr) {
            console.error('Failed to notify about subscription pause/resume:', notifErr.message);
        }

        const populated = await Subscription.findById(sub._id)
            .populate('vendor_id', 'business_name')
            .populate('menu_id', 'name meal_type items');

        res.json(withPopulated(populated));
    } catch (err) {
        next(err);
    }
});

export default router;
