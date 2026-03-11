import { Router } from 'express';
import Order from '../models/Order.js';
import Vendor from '../models/Vendor.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { sendNotification } from '../utils/notifications.js';

const router = Router();

function withVendor(order) {
    const obj = order.toJSON ? order.toJSON() : { ...order };
    if (order.vendorId && typeof order.vendorId === 'object') {
        obj.vendors = {
            business_name: order.vendorId.business_name,
            averageRating: order.vendorId.averageRating || 0,
            totalReviews: order.vendorId.totalReviews || 0
        };
        obj.vendorId = order.vendorId._id?.toString();
    }
    return obj;
}

function getTodayDate() {
    // Get today's date in YYYY-MM-DD format using IST (Asia/Kolkata)
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
}

function getVisibilityFilter() {
    // Removed restriction that hid future orders. 
    // Now all orders (past, present, future) are visible across dashboards.
    return {};
}

// GET /api/orders — my orders
router.get('/', authenticate, async (req, res, next) => {
    try {
        const { status, date } = req.query;
        const filter = { userId: req.user.userId, ...getVisibilityFilter() };
        if (status && status !== 'all') filter.orderStatus = status;
        if (date === 'today') filter.deliveryDate = getTodayDate();

        const orders = await Order.find(filter)
            .populate('vendorId', 'business_name')
            .sort({ createdAt: -1 });

        res.json(orders.map(withVendor));
    } catch (err) {
        next(err);
    }
});

// GET /api/orders/active — my active orders
router.get('/active', authenticate, async (req, res, next) => {
    try {
        const { date } = req.query;
        const filter = {
            userId: req.user.userId,
            orderStatus: { $in: ['pending', 'preparing', 'out_for_delivery'] },
            ...getVisibilityFilter()
        };
        if (date === 'today') filter.deliveryDate = getTodayDate();

        const orders = await Order.find(filter)
            .populate('vendorId', 'business_name')
            .sort({ createdAt: -1 });

        res.json(orders.map(withVendor));
    } catch (err) {
        next(err);
    }
});

// GET /api/orders/vendor/today — vendor's today's orders
router.get('/vendor/today', authenticate, async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ user_id: req.user.userId });
        if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });

        const today = getTodayDate();
        const orders = await Order.find({ vendorId: vendor._id, deliveryDate: today }).sort({ createdAt: -1 });

        res.json(orders.map((o) => o.toJSON()));
    } catch (err) {
        next(err);
    }
});

// GET /api/orders/vendor — vendor's orders
router.get('/vendor', authenticate, async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ user_id: req.user.userId });
        if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });

        const { status, limit } = req.query;
        const filter = { vendorId: vendor._id, ...getVisibilityFilter() };
        if (status && status !== 'all') filter.orderStatus = status;

        let query = Order.find(filter).sort({ createdAt: -1 });
        if (limit) query = query.limit(Number(limit));

        const orders = await query;
        res.json(orders.map((o) => o.toJSON()));
    } catch (err) {
        next(err);
    }
});

// GET /api/orders/vendor/earnings — vendor's earnings
router.get('/vendor/earnings', authenticate, async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ user_id: req.user.userId });
        if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });

        const orders = await Order.find({
            vendorId: vendor._id,
            orderStatus: { $ne: 'cancelled' },
            ...getVisibilityFilter()
        })
            .select('price orderStatus deliveryDate createdAt')
            .sort({ deliveryDate: -1 });

        res.json(orders.map((o) => o.toJSON()));
    } catch (err) {
        next(err);
    }
});

// POST /api/orders — place a single order
router.post('/', authenticate, async (req, res, next) => {
    console.log('📦 Received Order Request:', JSON.stringify(req.body, null, 2));
    try {
        const {
            vendorId, mealId, mealName, price,
            deliveryDate, deliveryTime, deliveryAddress, notes,
        } = req.body;

        const userId = req.user.userId;

        // Validation
        const required = ['vendorId', 'mealId', 'mealName', 'price', 'deliveryDate', 'deliveryTime', 'deliveryAddress'];
        const missing = required.filter(f => !req.body[f]);

        if (missing.length > 0) {
            console.error('❌ Validation Failed. Missing fields:', missing);
            return res.status(400).json({
                message: `Missing required fields: ${missing.join(', ')}`,
                missing
            });
        }

        // Notify User
        const vendor = await Vendor.findById(vendorId);

        const orderData = {
            userId,
            vendorId,
            vendorName: vendor ? vendor.business_name : 'Home Chef',
            mealId,
            mealName,
            price: Number(price),
            deliveryDate,
            deliveryTime,
            deliveryAddress,
            notes: notes || null,
            orderStatus: 'pending' // Initial status as per user request
        };

        console.log('📝 Attempting to create order with data:', JSON.stringify(orderData, null, 2));

        const order = await Order.create(orderData);

        // Broadcasting Notifications
        // 1. Notify Customer
        await sendNotification(userId, {
            title: 'Order Confirmed',
            message: `Your order from ${vendor ? vendor.business_name : 'the kitchen'} for ${mealName} is placed!`,
            type: 'order_placed',
            role: 'user',
            orderId: order._id,
            vendorId: vendorId,
            link: `/dashboard/track/${order._id}`
        });

        // 2. Notify Vendor
        if (vendor && vendor.user_id) {
            await sendNotification(vendor.user_id, {
                title: 'New Order Received! 🍱',
                message: `You have a new order for ${mealName} from ${req.user.full_name || 'a customer'}.`,
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
                title: 'Marketplace Alert: New Order',
                message: `A new order for ${mealName} has been placed at ${vendor ? vendor.business_name : 'a vendor'}.`,
                type: 'admin',
                role: 'admin',
                orderId: order._id,
                link: '/admin/orders'
            });
        }

        console.log('✅ Order Created Successfully:', order.id);
        res.status(201).json(order.toJSON());
    } catch (err) {
        console.error('❌ Order Creation Error:', err.message);
        next(err);
    }
});

// PUT /api/orders/:id/status — update order status
router.put('/:id/status', authenticate, async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!status) return res.status(400).json({ message: 'status is required' });

        let filter = { _id: req.params.id };
        if (req.user.role === 'vendor') {
            const vendor = await Vendor.findOne({ user_id: req.user.userId });
            if (vendor) filter.vendorId = vendor._id;
        } else if (req.user.role === 'user') {
            filter.userId = req.user.userId;
            if (status !== 'cancelled') return res.status(403).json({ message: 'Users can only cancel orders' });
        }

        const order = await Order.findOneAndUpdate(filter, { orderStatus: status }, { new: true }).populate('vendorId', 'business_name');
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Broadcasting Notifications to all stakeholders
        const statusMessages = {
            preparing: 'Your meal is now being prepared! 🌱',
            out_for_delivery: 'Your food is out for delivery and will arrive soon! 🚚',
            delivered: 'Delivered! Enjoy your home-style meal. 🍱',
            cancelled: 'Unfortunately, your order was cancelled.'
        };

        const title = `Order ${status.replace(/_/g, " ")}`;
        const message = statusMessages[status] || `Order status updated to ${status}.`;

        // 1. Notify Customer
        await sendNotification(order.userId, {
            title,
            message,
            type: status,
            role: 'user',
            orderId: order._id,
            vendorId: order.vendorId ? order.vendorId._id : null,
            link: `/dashboard/track/${order._id}` // Fixed link to track page
        });

        // 2. Notify Vendor
        if (order.vendorId) {
            const vendorUser = await User.findOne({ _id: order.vendorId.user_id || order.vendorId });
            if (vendorUser) {
                await sendNotification(vendorUser._id, {
                    title: `Order Update: ${order.mealName}`,
                    message: `Status of ${order.mealName} changed to ${status}.`,
                    type: status,
                    role: 'vendor',
                    orderId: order._id,
                    link: '/vendor/orders'
                });
            }
        }

        // 3. Notify Admins
        const admins = await User.find({ role: 'admin' });
        for (const admin of admins) {
            await sendNotification(admin._id, {
                title: `Admin Alert: Order ${status}`,
                message: `Order for ${order.mealName} is now ${status}.`,
                type: 'admin',
                role: 'admin',
                orderId: order._id,
                link: '/admin/orders'
            });
        }

        res.json(withVendor(order));
    } catch (err) {
        next(err);
    }
});

// GET /api/orders/:id — get single order details
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        let filter = { _id: req.params.id };

        if (req.user.role === 'vendor') {
            const vendor = await Vendor.findOne({ user_id: req.user.userId });
            if (!vendor) return res.status(403).json({ message: 'Vendor profile not found' });
            filter.vendorId = vendor._id;
        } else if (req.user.role === 'user') {
            filter.userId = req.user.userId;
        }

        const order = await Order.findOne(filter).populate('vendorId', 'business_name');

        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(withVendor(order));
    } catch (err) {
        next(err);
    }
});

export default router;
