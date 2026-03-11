import { Router } from 'express';
import Vendor from '../models/Vendor.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Helper to serialize vendor with populated fields
function serializeVendor(vendor) {
    const v = vendor.toJSON ? vendor.toJSON() : vendor;
    return v;
}

// GET /api/vendors  — all approved+active vendors (public)
router.get('/', async (req, res, next) => {
    try {
        const vendors = await Vendor.find({ is_approved: true, is_active: true }).sort({ createdAt: -1 });
        res.json(vendors.map(serializeVendor));
    } catch (err) {
        next(err);
    }
});

// GET /api/vendors/me  — my vendor profile (vendor only)
router.get('/me', authenticate, async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ user_id: req.user.userId });
        if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });
        res.json(serializeVendor(vendor));
    } catch (err) {
        next(err);
    }
});

// POST /api/vendors  — create vendor profile
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { business_name, description, phone, address, delivery_radius_km, is_active } = req.body;
        if (!business_name) return res.status(400).json({ message: 'business_name is required' });

        const existing = await Vendor.findOne({ user_id: req.user.userId });
        if (existing) return res.status(409).json({ message: 'Vendor profile already exists. Use PUT to update.' });

        const vendor = await Vendor.create({
            user_id: req.user.userId,
            business_name,
            description: description || null,
            phone: phone || null,
            address: address || null,
            delivery_radius_km: delivery_radius_km || 5,
            is_active: is_active !== undefined ? is_active : true,
        });
        res.status(201).json(serializeVendor(vendor));
    } catch (err) {
        next(err);
    }
});

// PUT /api/vendors/me  — update vendor profile
router.put('/me', authenticate, async (req, res, next) => {
    try {
        const { business_name, description, phone, address, delivery_radius_km, is_active } = req.body;
        const vendor = await Vendor.findOneAndUpdate(
            { user_id: req.user.userId },
            {
                ...(business_name !== undefined && { business_name }),
                ...(description !== undefined && { description: description || null }),
                ...(phone !== undefined && { phone: phone || null }),
                ...(address !== undefined && { address: address || null }),
                ...(delivery_radius_km !== undefined && { delivery_radius_km: Number(delivery_radius_km) || 5 }),
                ...(is_active !== undefined && { is_active }),
            },
            { new: true }
        );
        if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });
        res.json(serializeVendor(vendor));
    } catch (err) {
        next(err);
    }
});

export default router;
