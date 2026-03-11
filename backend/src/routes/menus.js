import { Router } from 'express';
import Menu from '../models/Menu.js';
import Vendor from '../models/Vendor.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Serialize menu with vendor embedded
function serializeMenu(menu, vendor) {
    const m = menu.toJSON ? menu.toJSON() : menu;
    if (vendor) {
        m.vendors = {
            business_name: vendor.business_name,
            averageRating: vendor.averageRating || 0,
            totalReviews: vendor.totalReviews || 0,
            id: vendor._id?.toString() || vendor.id
        };
    }
    return m;
}

// GET /api/menus  — public available menus (with optional meal_type filter)
router.get('/', async (req, res, next) => {
    try {
        const { meal_type } = req.query;
        const filter = { is_available: true };
        if (meal_type && meal_type !== 'all') filter.meal_type = meal_type;

        const menus = await Menu.find(filter).populate('vendor_id').sort({ createdAt: -1 });

        const result = menus.map((m) => {
            const obj = m.toJSON();
            const vendorDoc = m.vendor_id;
            if (vendorDoc && typeof vendorDoc === 'object' && vendorDoc.business_name) {
                obj.vendors = {
                    business_name: vendorDoc.business_name,
                    averageRating: vendorDoc.averageRating || 0,
                    totalReviews: vendorDoc.totalReviews || 0,
                    id: vendorDoc._id?.toString() || vendorDoc.id
                };
            }
            return obj;
        });

        res.json(result);
    } catch (err) {
        next(err);
    }
});

// GET /api/menus/mine  — vendor's own menus
router.get('/mine', authenticate, async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ user_id: req.user.userId });
        if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });

        const menus = await Menu.find({ vendor_id: vendor._id }).sort({ createdAt: -1 });
        res.json(menus.map((m) => m.toJSON()));
    } catch (err) {
        next(err);
    }
});

// POST /api/menus  — create menu (vendor)
router.post('/', authenticate, async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ user_id: req.user.userId });
        if (!vendor) return res.status(404).json({ message: 'Set up vendor profile first' });

        const { name, description, meal_type, price, items, is_available, diet_type, category, image_url } = req.body;
        if (!name || !meal_type || price === undefined || !diet_type) {
            return res.status(400).json({ message: 'name, meal_type, price, and diet_type are required' });
        }

        const menu = await Menu.create({
            vendor_id: vendor._id,
            name,
            description: description || null,
            meal_type,
            price: Number(price),
            items: items || [],
            is_available: is_available !== undefined ? is_available : true,
            diet_type,
            category: category || 'general',
            image_url: image_url || null,
        });
        res.status(201).json(menu.toJSON());
    } catch (err) {
        next(err);
    }
});

// PUT /api/menus/:id  — update menu
router.put('/:id', authenticate, async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ user_id: req.user.userId });
        if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });

        const { name, description, meal_type, price, items, is_available, diet_type, category, image_url } = req.body;
        const menu = await Menu.findOneAndUpdate(
            { _id: req.params.id, vendor_id: vendor._id },
            {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description: description || null }),
                ...(meal_type !== undefined && { meal_type }),
                ...(price !== undefined && { price: Number(price) }),
                ...(items !== undefined && { items }),
                ...(is_available !== undefined && { is_available }),
                ...(diet_type !== undefined && { diet_type }),
                ...(category !== undefined && { category }),
                ...(image_url !== undefined && { image_url }),
            },
            { new: true }
        );
        if (!menu) return res.status(404).json({ message: 'Menu not found' });
        res.json(menu.toJSON());
    } catch (err) {
        next(err);
    }
});

// GET /api/menus/:id  — get single menu item
router.get('/:id', async (req, res, next) => {
    try {
        const menu = await Menu.findById(req.params.id).populate('vendor_id');
        if (!menu) return res.status(404).json({ message: 'Menu not found' });

        const obj = menu.toJSON();
        const vendorDoc = menu.vendor_id;
        if (vendorDoc && typeof vendorDoc === 'object' && vendorDoc.business_name) {
            obj.vendors = {
                business_name: vendorDoc.business_name,
                averageRating: vendorDoc.averageRating || 0,
                totalReviews: vendorDoc.totalReviews || 0,
                id: vendorDoc._id?.toString() || vendorDoc.id
            };
        }
        res.json(obj);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/menus/:id  — delete menu
router.delete('/:id', authenticate, async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ user_id: req.user.userId });
        if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });

        const menu = await Menu.findOneAndDelete({ _id: req.params.id, vendor_id: vendor._id });
        if (!menu) return res.status(404).json({ message: 'Menu not found' });
        res.json({ message: 'Menu deleted' });
    } catch (err) {
        next(err);
    }
});

export default router;
