import { Router } from 'express';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Order from '../models/Order.js';
import Subscription from '../models/Subscription.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// All admin routes require admin role
router.use(authenticate, requireRole('admin'));

function getTodayDate() {
    // Get today's date in YYYY-MM-DD format using IST (Asia/Kolkata)
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
}

// GET /api/admin/stats  — platform overview stats
router.get('/stats', async (req, res, next) => {
    try {
        const today = getTodayDate();

        const [userCount, vendorStats, orderStats] = await Promise.all([
            User.countDocuments(),
            Vendor.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: { $sum: { $cond: [{ $and: ['$is_approved', '$is_active'] }, 1, 0] } },
                        pending: { $sum: { $cond: ['$is_approved', 0, 1] } },
                    },
                },
            ]),
            Order.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        today: { $sum: { $cond: [{ $eq: ['$deliveryDate', today] }, 1, 0] } },
                        revenue: {
                            $sum: {
                                $cond: [{ $ne: ['$orderStatus', 'cancelled'] }, '$price', 0],
                            },
                        },
                    },
                },
            ]),
        ]);

        res.json({
            users: userCount,
            vendors: vendorStats[0] || { total: 0, active: 0, pending: 0 },
            orders: orderStats[0] || { total: 0, today: 0, revenue: 0 },
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/admin/users  — all users with role filter
router.get('/users', async (req, res, next) => {
    try {
        const { role } = req.query;
        const filter = role && role !== 'all' ? { role } : {};
        const users = await User.find(filter).sort({ createdAt: -1 });
        res.json(users.map((u) => u.toJSON()));
    } catch (err) {
        next(err);
    }
});

// PUT /api/admin/users/:id/role  — update user role
router.put('/users/:id/role', async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!['user', 'vendor', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.toJSON());
    } catch (err) {
        next(err);
    }
});

// GET /api/admin/vendors  — all vendors with filter
router.get('/vendors', async (req, res, next) => {
    try {
        const { filter } = req.query;
        let query = {};
        if (filter === 'pending') query.is_approved = false;
        else if (filter === 'approved') query.is_approved = true;
        else if (filter === 'inactive') query.is_active = false;

        const vendors = await Vendor.find(query).sort({ createdAt: -1 });
        res.json(vendors.map((v) => v.toJSON()));
    } catch (err) {
        next(err);
    }
});

// PUT /api/admin/vendors/:id  — update vendor (approve/deactivate)
router.put('/vendors/:id', async (req, res, next) => {
    try {
        const updates = {};
        if (req.body.is_approved !== undefined) updates.is_approved = req.body.is_approved;
        if (req.body.is_active !== undefined) updates.is_active = req.body.is_active;

        const vendor = await Vendor.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        res.json(vendor.toJSON());
    } catch (err) {
        next(err);
    }
});

function getVisibilityFilter() {
    // Show all orders to admin for full management visibility.
    return {};
}

// GET /api/admin/orders  — all orders with optional status filter
router.get('/orders', async (req, res, next) => {
    try {
        const { status } = req.query;
        const filter = { ...getVisibilityFilter() };
        if (status && status !== 'all') filter.orderStatus = status;

        const orders = await Order.find(filter)
            .populate('vendorId', 'business_name')
            .sort({ createdAt: -1 })
            .limit(100);

        const result = orders.map((o) => {
            const obj = o.toJSON();
            if (o.vendorId && typeof o.vendorId === 'object') {
                obj.vendors = { business_name: o.vendorId.business_name };
                obj.vendorId = o.vendorId._id?.toString() || o.vendorId.toString();
            }
            return obj;
        });

        res.json(result);
    } catch (err) {
        next(err);
    }
});

// PUT /api/admin/orders/:id/status  — update order status
router.put('/orders/:id/status', async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: status }, { new: true }).populate('vendorId', 'business_name');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        const obj = order.toJSON();
        if (order.vendorId && typeof order.vendorId === 'object') {
            obj.vendors = {
                business_name: order.vendorId.business_name,
                averageRating: order.vendorId.averageRating || 0,
                totalReviews: order.vendorId.totalReviews || 0
            };
            obj.vendorId = order.vendorId._id?.toString() || order.vendorId.toString();
        }
        res.json(obj);
    } catch (err) {
        next(err);
    }
});

// GET /api/admin/analytics  — analytics data
router.get('/analytics', async (req, res, next) => {
    try {
        const [orders, subs] = await Promise.all([
            Order.find({ orderStatus: { $ne: 'cancelled' } }).select('price orderStatus deliveryDate mealName'),
            Subscription.find().select('status plan_type amount start_date createdAt'),
        ]);

        res.json({
            orders: orders.map((o) => o.toJSON()),
            subscriptions: subs.map((s) => s.toJSON()),
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/admin/recent-orders  — recent 5 orders
router.get('/recent-orders', async (req, res, next) => {
    try {
        const { date } = req.query;
        const filter = { ...getVisibilityFilter() };
        if (date === 'today') filter.deliveryDate = getTodayDate();

        const orders = await Order.find(filter)
            .populate('vendorId', 'business_name')
            .sort({ createdAt: -1 })
            .limit(5);

        const result = orders.map((o) => {
            const obj = o.toJSON();
            if (o.vendorId && typeof o.vendorId === 'object') {
                obj.vendors = { business_name: o.vendorId.business_name };
                obj.vendorId = o.vendorId._id?.toString() || o.vendorId.toString();
            }
            return obj;
        });

        res.json(result);
    } catch (err) {
        next(err);
    }
});

export default router;
