import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema(
    {
        vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
        name: { type: String, required: true, index: true },
        description: { type: String, default: null },
        meal_type: { type: String, enum: ['lunch', 'dinner', 'both'], required: true, index: true },
        price: { type: Number, required: true, index: true },
        is_available: { type: Boolean, default: true, index: true },
        items: { type: [String], default: [] },
        diet_type: { type: String, enum: ['veg', 'non-veg', 'vegan'], default: 'veg', required: true, index: true },
        category: { type: String, default: 'general', index: true },
        image_url: { type: String, default: null },
        averageRating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
    },

    { timestamps: true }
);

menuSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.vendor_id = ret.vendor_id?._id?.toString() || ret.vendor_id?.id?.toString() || ret.vendor_id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model('Menu', menuSchema);
