import mongoose from 'mongoose';

const weeklyPlanSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', default: null },
        weekStartDate: { type: String, required: true }, // YYYY-MM-DD (Monday of the planned week)
        selections: [
            {
                day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
                lunch: {
                    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
                    menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
                    mealName: String,
                },
                dinner: {
                    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
                    menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
                    mealName: String,
                }
            }
        ]
    },
    { timestamps: true }
);

// Index to prevent duplicate plans for the same user/week
weeklyPlanSchema.index({ userId: 1, weekStartDate: 1 }, { unique: true });

weeklyPlanSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model('WeeklyPlan', weeklyPlanSchema);
