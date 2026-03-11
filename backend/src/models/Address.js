import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        label: { type: String, default: 'Home' },
        address_line: { type: String, required: true },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        pincode: { type: String, default: '' },
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
        is_default: { type: Boolean, default: false },
    },
    { timestamps: true }
);

addressSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.user_id = ret.user_id?._id?.toString() || ret.user_id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model('Address', addressSchema);
