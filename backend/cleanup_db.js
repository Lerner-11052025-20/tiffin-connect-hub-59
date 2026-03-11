import 'dotenv/config';
import mongoose from 'mongoose';
import User from './src/models/User.js';
import Vendor from './src/models/Vendor.js';
import Menu from './src/models/Menu.js';
import Order from './src/models/Order.js';
import Payment from './src/models/Payment.js';
import Subscription from './src/models/Subscription.js';
import SubscriptionOverride from './src/models/SubscriptionOverride.js';
import Address from './src/models/Address.js';
import Notification from './src/models/Notification.js';
import WeeklyPlan from './src/models/WeeklyPlan.js';
import Review from './src/models/Review.js';

async function cleanup() {
    try {
        console.log('🔄 Connecting to MongoDB for cleanup...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected.');

        // 1. Delete all operational data
        console.log('🗑️ Deleting operational documents...');
        const deleteOps = [
            Vendor.deleteMany({}),
            Menu.deleteMany({}),
            Order.deleteMany({}),
            Payment.deleteMany({}),
            Subscription.deleteMany({}),
            SubscriptionOverride.deleteMany({}),
            Address.deleteMany({}),
            Notification.deleteMany({}),
            WeeklyPlan.deleteMany({}),
            Review.deleteMany({})
        ];
        
        await Promise.all(deleteOps);
        console.log('✅ Operational data cleared.');

        // 2. Delete non-admin users
        console.log('🗑️ Deleting non-admin user accounts...');
        const result = await User.deleteMany({ role: { $ne: 'admin' } });
        console.log(`✅ ${result.deletedCount} non-admin user accounts deleted.`);

        console.log('✨ Cleanup complete. Only admin accounts remain.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during cleanup:', error.message);
        process.exit(1);
    }
}

cleanup();
