import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Re-using the logic from User model but manually to ensure it works without complex imports if needed
dotenv.config({ path: './backend/.env' });

const MONGODB_URI = "mongodb+srv://deepsorathiya803_db_user:tqdw1nA6EARfAhfp@cluster9898.eykquok.mongodb.net/tiffinconnect?retryWrites=true&w=majority&appName=Cluster9898";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
    full_name: { type: String, default: '' },
    phone: { type: String, default: null }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdmin() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        const email = 'adminglobal@gmail.com';
        const passwordPlain = 'Admin@123';
        const hashedPassword = await bcrypt.hash(passwordPlain, 10);

        const userData = {
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'admin',
            full_name: 'Global Admin'
        };

        const existingUser = await User.findOne({ email: userData.email });

        if (existingUser) {
            console.log('User already exists, updating role to admin and resetting password...');
            existingUser.role = 'admin';
            existingUser.password = hashedPassword;
            existingUser.full_name = 'Global Admin';
            await existingUser.save();
            console.log('User updated successfully!');
        } else {
            console.log('Creating new admin user...');
            await User.create(userData);
            console.log('Admin user created successfully!');
        }

    } catch (err) {
        console.error('Error during creation:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
        process.exit(0);
    }
}

createAdmin();
