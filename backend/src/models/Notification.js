import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['admin', 'vendor', 'user'], default: 'user' },
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: {
            type: String,
            enum: ['pending', 'order_placed', 'new_order', 'order_confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled', 'system', 'admin'],
            default: 'system'
        },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', default: null },
        eta: { type: String, default: null },
        link: { type: String, default: null },
        isRead: { type: Boolean, default: false }
    },
    { timestamps: true }
);

notificationSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model('Notification', notificationSchema);
