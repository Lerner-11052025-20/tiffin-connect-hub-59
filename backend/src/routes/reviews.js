import { Router } from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Vendor from '../models/Vendor.js';
import Menu from '../models/Menu.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Helper to update vendor rating
async function updateVendorStats(vendorId) {
    const stats = await Review.aggregate([
        { $match: { vendorId: new mongoose.Types.ObjectId(vendorId) } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    const averageRating = stats.length > 0 ? parseFloat(stats[0].averageRating.toFixed(1)) : 0;
    const totalReviews = stats.length > 0 ? stats[0].totalReviews : 0;

    await Vendor.findByIdAndUpdate(vendorId, { averageRating, totalReviews });
}

// Helper to update menu rating
async function updateMenuStats(menuId) {
    const stats = await Review.aggregate([
        { $match: { menuId: new mongoose.Types.ObjectId(menuId) } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    const averageRating = stats.length > 0 ? parseFloat(stats[0].averageRating.toFixed(1)) : 0;
    const totalReviews = stats.length > 0 ? stats[0].totalReviews : 0;

    await Menu.findByIdAndUpdate(menuId, { averageRating, totalReviews });
}

// POST /api/reviews — Submit a review
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { orderId, rating, reviewText } = req.body;
        const userId = req.user.userId;

        // 1. Verify order exists, belongs to user, and is delivered
        const order = await Order.findOne({ _id: orderId, userId, orderStatus: 'delivered' });
        if (!order) {
            return res.status(400).json({ message: 'Order not found or not eligible for review.' });
        }

        // 2. Check if already reviewed (Review model has unique orderId index)
        const exists = await Review.findOne({ orderId });
        if (exists) {
            return res.status(400).json({ message: 'You have already reviewed this order.' });
        }

        // 3. Create review
        const review = await Review.create({
            userId,
            vendorId: order.vendorId,
            menuId: order.mealId,
            orderId,
            rating,
            reviewText
        });

        // 4. Update vendor and menu stats
        await updateVendorStats(order.vendorId);
        await updateMenuStats(order.mealId);

        res.status(201).json(review.toJSON());
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: 'Order already reviewed.' });
        next(err);
    }
});

// GET /api/reviews/vendor/:vendorId — Public reviews for a vendor
router.get('/vendor/:vendorId', async (req, res, next) => {
    try {
        const { vendorId } = req.params;
        const { sort = 'recent', page = 1, limit = 10 } = req.query;

        let sortQuery = { createdAt: -1 };
        if (sort === 'highest') sortQuery = { rating: -1 };
        if (sort === 'lowest') sortQuery = { rating: 1 };

        const reviews = await Review.find({ vendorId })
            .populate('userId', 'full_name')
            .sort(sortQuery)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Review.countDocuments({ vendorId });

        res.json({
            reviews: reviews.map(r => {
                const obj = r.toJSON();
                obj.userName = r.userId?.full_name || 'Anonymous';
                return obj;
            }),
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: Number(page)
            }
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/reviews/my-vendor — Vendor views their own reviews
router.get('/my-vendor', authenticate, requireRole('vendor'), async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ user_id: req.user.userId });
        if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });

        const { page = 1, limit = 10 } = req.query;

        const reviews = await Review.find({ vendorId: vendor._id })
            .populate('userId', 'full_name')
            .populate('orderId', 'mealName deliveryDate')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Review.countDocuments({ vendorId: vendor._id });

        const positiveCount = await Review.countDocuments({ vendorId: vendor._id, rating: { $gte: 4 } });
        const positiveFeedback = total > 0 ? Math.round((positiveCount / total) * 100) : 0;

        res.json({
            reviews,
            total,
            positiveFeedback,
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/reviews/admin — Admin moderation view
router.get('/admin', authenticate, requireRole('admin'), async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const reviews = await Review.find()
            .populate('userId', 'full_name email')
            .populate('vendorId', 'business_name')
            .populate('orderId', 'mealName deliveryDate')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Review.countDocuments();

        res.json({ reviews, total });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/reviews/:id — Admin delete review
router.delete('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Update stats after deletion
        await updateVendorStats(review.vendorId);
        await updateMenuStats(review.menuId);

        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        next(err);
    }
});

// GET /api/reviews/menu/:menuId — Public reviews for a menu
router.get('/menu/:menuId', async (req, res, next) => {
    try {
        const { menuId } = req.params;
        const { sort = 'recent', page = 1, limit = 10 } = req.query;

        let sortQuery = { createdAt: -1 };
        if (sort === 'highest') sortQuery = { rating: -1 };
        if (sort === 'lowest') sortQuery = { rating: 1 };

        const reviews = await Review.find({ menuId })
            .populate('userId', 'full_name')
            .sort(sortQuery)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Review.countDocuments({ menuId });

        res.json({
            reviews: reviews.map(r => {
                const obj = r.toJSON();
                obj.userName = r.userId?.full_name || 'Anonymous';
                return obj;
            }),
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: Number(page)
            }
        });
    } catch (err) {
        next(err);
    }
});

export default router;
