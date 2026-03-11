import { Router } from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/profiles/me
router.get('/me', authenticate, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'Profile not found' });
        res.json(user.toJSON());
    } catch (err) {
        next(err);
    }
});

// PUT /api/profiles/me
router.put('/me', authenticate, async (req, res, next) => {
    try {
        const { full_name, phone, notificationSettings } = req.body;

        let updateData = { full_name, phone: phone || null };
        if (notificationSettings) {
            updateData.notificationSettings = notificationSettings;
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.toJSON());
    } catch (err) {
        next(err);
    }
});

export default router;
