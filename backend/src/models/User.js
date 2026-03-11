import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6 },
        role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
        full_name: { type: String, default: '' },
        phone: { type: String, default: null },
        avatar_url: { type: String, default: null },
        notificationSettings: {
            email: { type: Boolean, default: true },
            inApp: { type: Boolean, default: true },
            push: { type: Boolean, default: false }
        }
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Transform _id to id in JSON output
userSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.user_id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
    },
});

export default mongoose.model('User', userSchema);
