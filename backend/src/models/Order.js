import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
        vendorName: { type: String, required: true },
        subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', default: null },
        mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
        mealName: { type: String, required: true },
        price: { type: Number, required: true },
        deliveryDate: { type: String, required: true },
        deliveryTime: { type: String, required: true },
        deliveryAddress: { type: String, required: true }, // Store full address as requested
        notes: { type: String, default: null },
        paymentId: { type: String, default: null },           // stripe payment_intent or session_id
        stripeSessionId: { type: String, default: null },     // stripe checkout session id
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        orderStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

// Indexes for performance
orderSchema.index({ userId: 1 });
orderSchema.index({ vendorId: 1 });
orderSchema.index({ deliveryDate: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.userId = ret.userId?._id?.toString() || ret.userId?.toString();
        ret.vendorId = ret.vendorId?._id?.toString() || ret.vendorId?.toString();
        ret.mealId = ret.mealId?._id?.toString() || ret.mealId?.toString();
        ret.subscriptionId = ret.subscriptionId?._id?.toString() || ret.subscriptionId?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model('Order', orderSchema);
