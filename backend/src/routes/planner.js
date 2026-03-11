import { Router } from 'express';
import WeeklyPlan from '../models/WeeklyPlan.js';
import Order from '../models/Order.js';
import { authenticate } from '../middleware/auth.js';
import { addDays, format, parseISO } from 'date-fns';

const router = Router();

// GET /api/planner/:weekStart — get plan for a specific week
router.get('/:weekStart', authenticate, async (req, res, next) => {
    try {
        const { weekStart } = req.params; // Expect YYYY-MM-DD
        const plan = await WeeklyPlan.findOne({ userId: req.user.userId, weekStartDate: weekStart });
        res.json(plan || { weekStartDate: weekStart, selections: [] });
    } catch (err) {
        next(err);
    }
});

// POST /api/planner — save weekly plan & sync with existing orders
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { weekStartDate, selections, subscriptionId } = req.body;
        if (!weekStartDate || !selections) {
            return res.status(400).json({ message: 'weekStartDate and selections are required' });
        }

        // 1. Update/Save WeeklyPlan
        let plan = await WeeklyPlan.findOneAndUpdate(
            { userId: req.user.userId, weekStartDate },
            { selections, subscriptionId },
            { new: true, upsert: true }
        );

        // 2. Sync with existing orders for this week
        const startDate = parseISO(weekStartDate);

        const syncPromises = selections.map(async (sel) => {
            const dayMap = {
                'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4, 'Saturday': 5, 'Sunday': 6
            };
            const targetDate = addDays(startDate, dayMap[sel.day]);
            const formattedDate = format(targetDate, 'yyyy-MM-dd');

            // Process Lunch
            if (sel.lunch && sel.lunch.menuId) {
                await Order.updateMany(
                    {
                        userId: req.user.userId,
                        deliveryDate: formattedDate,
                        orderStatus: { $in: ['pending', 'confirmed'] },
                        // Filter for lunch time (simple check: before 4 PM)
                        deliveryTime: { $regex: /^(0[0-9]|1[0-5]):/ }
                    },
                    {
                        vendorId: sel.lunch.vendorId,
                        mealId: sel.lunch.menuId,
                        mealName: sel.lunch.mealName
                    }
                );
            }

            // Process Dinner
            if (sel.dinner && sel.dinner.menuId) {
                await Order.updateMany(
                    {
                        userId: req.user.userId,
                        deliveryDate: formattedDate,
                        orderStatus: { $in: ['pending', 'confirmed'] },
                        // Filter for dinner time (simple check: 4 PM or later)
                        deliveryTime: { $regex: /^(1[6-9]|2[0-3]):/ }
                    },
                    {
                        vendorId: sel.dinner.vendorId,
                        mealId: sel.dinner.menuId,
                        mealName: sel.dinner.mealName
                    }
                );
            }
        });

        await Promise.all(syncPromises);

        res.json({ message: 'Plan saved and orders synchronized successfully', plan });
    } catch (err) {
        next(err);
    }
});

export default router;
