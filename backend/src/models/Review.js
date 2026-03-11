import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
        menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        reviewText: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

// Indexes for performance
reviewSchema.index({ vendorId: 1 });
reviewSchema.index({ menuId: 1 });
reviewSchema.index({ orderId: 1 });
reviewSchema.index({ createdAt: -1 });

reviewSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model('Review', reviewSchema);
