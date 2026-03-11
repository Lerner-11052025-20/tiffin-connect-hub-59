import mongoose from 'mongoose';

const overrideSchema = new mongoose.Schema(
    {
        subscription_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
        date: { type: String, required: true }, // Format: YYYY-MM-DD
        status: { type: String, enum: ['skipped', 'paused'], required: true },
    },
    { timestamps: true }
);

// Prevent duplicate overrides for the same subscription on the same date
overrideSchema.index({ subscription_id: 1, date: 1 }, { unique: true });

overrideSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.subscription_id = ret.subscription_id?._id?.toString() || ret.subscription_id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model('SubscriptionOverride', overrideSchema);
