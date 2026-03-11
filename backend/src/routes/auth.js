import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
    try {
        const { email, password, full_name, phone, role } = req.body;
        if (!email || !password || !full_name) {
            return res.status(400).json({ message: 'Email, password and full name are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) return res.status(409).json({ message: 'Email already registered' });

        const allowedRoles = ['user', 'vendor'];
        const assignedRole = allowedRoles.includes(role) ? role : 'user';

        const user = await User.create({ email, password, full_name, phone: phone || null, role: assignedRole });

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ token, user: user.toJSON() });
    } catch (err) {
        next(err);
    }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        const valid = await user.comparePassword(password);
        if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, user: user.toJSON() });
    } catch (err) {
        next(err);
    }
});

// GET /api/auth/me  — validate token & return user
router.get('/me', authenticate, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user: user.toJSON() });
    } catch (err) {
        next(err);
    }
});

export default router;
