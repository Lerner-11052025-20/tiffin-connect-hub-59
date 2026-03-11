import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
        menu_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', default: null },
        delivery_address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', default: null },
        plan_type: { type: String, enum: ['daily', 'weekly', 'biweekly', 'monthly'], required: true },
        meal_type: { type: String, enum: ['lunch', 'dinner', 'both'], required: true },
        lunch_time: { type: String, default: '12:30' },
        dinner_time: { type: String, default: '19:30' },
        status: { type: String, enum: ['active', 'paused', 'cancelled', 'expired', 'completed'], default: 'active' },
        start_date: { type: String, required: true },
        end_date: { type: String, default: null },
        total_plan_days: { type: Number, default: 0 },
        delivered_count: { type: Number, default: 0 },
        remaining_days: { type: Number, default: 0 },
        amount: { type: Number, required: true },
        stripeSessionId: { type: String, default: null },
        paymentIntentId: { type: String, default: null },
        pause_start_date: { type: String, default: null },
    },
    { timestamps: true }
);

subscriptionSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.user_id = ret.user_id?._id?.toString() || ret.user_id?.toString();
        ret.vendor_id = ret.vendor_id?._id?.toString() || ret.vendor_id?.toString();
        ret.menu_id = ret.menu_id?._id?.toString() || ret.menu_id?.toString();
        ret.delivery_address_id = ret.delivery_address_id?._id?.toString() || ret.delivery_address_id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model('Subscription', subscriptionSchema);
