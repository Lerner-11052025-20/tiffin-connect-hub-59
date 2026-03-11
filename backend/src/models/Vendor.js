import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        business_name: { type: String, required: true },
        description: { type: String, default: null },
        phone: { type: String, default: null },
        address: { type: String, default: null },
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
        delivery_radius_km: { type: Number, default: 5.0 },
        is_approved: { type: Boolean, default: false },
        is_active: { type: Boolean, default: true },
        averageRating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
    },
    { timestamps: true }
);

vendorSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.user_id = ret.user_id?._id?.toString() || ret.user_id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model('Vendor', vendorSchema);
