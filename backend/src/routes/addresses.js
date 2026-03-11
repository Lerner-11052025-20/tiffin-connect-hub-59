import { Router } from 'express';
import Address from '../models/Address.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/addresses  — get all my addresses
router.get('/', authenticate, async (req, res, next) => {
    try {
        const addresses = await Address.find({ user_id: req.user.userId }).sort({ is_default: -1, createdAt: -1 });
        res.json(addresses.map((a) => a.toJSON()));
    } catch (err) {
        next(err);
    }
});

// POST /api/addresses  — add a new address
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { label, address_line, city, state, pincode, latitude, longitude } = req.body;
        if (!address_line) return res.status(400).json({ message: 'address_line is required' });

        const address = await Address.create({
            user_id: req.user.userId,
            label: label || 'Home',
            address_line,
            city: city || '',
            state: state || '',
            pincode: pincode || '',
            latitude: latitude ?? null,
            longitude: longitude ?? null,
        });
        res.status(201).json(address.toJSON());
    } catch (err) {
        next(err);
    }
});

// DELETE /api/addresses/:id  — delete an address
router.delete('/:id', authenticate, async (req, res, next) => {
    try {
        const address = await Address.findOneAndDelete({ _id: req.params.id, user_id: req.user.userId });
        if (!address) return res.status(404).json({ message: 'Address not found' });
        res.json({ message: 'Address deleted' });
    } catch (err) {
        next(err);
    }
});

export default router;
