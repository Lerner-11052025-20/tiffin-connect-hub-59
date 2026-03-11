import 'dotenv/config';
import mongoose from 'mongoose';
import User from './src/models/User.js';

async function verify() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const nonAdmins = await User.countDocuments({ role: { $ne: 'admin' } });
        console.log(`Non-admin users: ${nonAdmins}`);
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
}
verify();
