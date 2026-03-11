import { Router } from 'express';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/notifications
router.get('/', authenticate, async (req, res, next) => {
    try {
        const notifications = await Notification.find({ userId: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications.map(n => n.toJSON()));
    } catch (err) {
        next(err);
    }
});

// GET /api/notifications/unread-count
router.get('/unread-count', authenticate, async (req, res, next) => {
    try {
        const count = await Notification.countDocuments({ userId: req.user.userId, isRead: false });
        res.json({ count });
    } catch (err) {
        next(err);
    }
});

// PUT /api/notifications/read-all
router.put('/read-all', authenticate, async (req, res, next) => {
    try {
        await Notification.updateMany(
            { userId: req.user.userId, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        next(err);
    }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', authenticate, async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { $set: { isRead: true } },
            { new: true }
        );
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.json(notification.toJSON());
    } catch (err) {
        next(err);
    }
});

// DELETE /api/notifications/:id
router.delete('/:id', authenticate, async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.json({ message: 'Notification deleted' });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/notifications
router.delete('/', authenticate, async (req, res, next) => {
    try {
        await Notification.deleteMany({ userId: req.user.userId });
        res.json({ message: 'All notifications cleared' });
    } catch (err) {
        next(err);
    }
});

export default router;
