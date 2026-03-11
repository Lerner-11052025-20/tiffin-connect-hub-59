import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        const adminEmail = 'adminglobal@gmail.com';
        const adminPassword = 'Admin@123';

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin already exists. Updating password and role...');
            existingAdmin.password = adminPassword;
            existingAdmin.role = 'admin';
            existingAdmin.full_name = 'Global Admin';
            await existingAdmin.save();
            console.log('Admin updated successfully.');
        } else {
            console.log('Creating new global admin...');
            await User.create({
                email: adminEmail,
                password: adminPassword,
                full_name: 'Global Admin',
                role: 'admin'
            });
            console.log('Global admin created successfully.');
        }

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    } catch (err) {
        console.error('Error seeding admin:', err);
        process.exit(1);
    }
};

seedAdmin();
