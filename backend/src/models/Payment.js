import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
        subscription_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', default: null },
        stripeSessionId: { type: String, default: null },
        paymentIntentId: { type: String, default: null },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'INR' },
        status: {
            type: String,
            enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
            default: 'created',
        },
        method: { type: String, default: null },
    },
    { timestamps: true }
);

paymentSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.user_id = ret.user_id?._id?.toString() || ret.user_id?.toString();
        ret.order_id = ret.order_id?._id?.toString() || ret.order_id?.toString();
        ret.subscription_id = ret.subscription_id?._id?.toString() || ret.subscription_id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model('Payment', paymentSchema);
