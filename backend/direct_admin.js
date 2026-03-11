import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = "mongodb+srv://deepsorathiya803_db_user:tqdw1nA6EARfAhfp@cluster9898.eykquok.mongodb.net/tiffinconnect?retryWrites=true&w=majority&appName=Cluster9898";

async function run() {
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        const db = client.db('tiffinconnect');
        const users = db.collection('users');

        const email = 'adminglobal@gmail.com';
        const passwordPlain = 'Admin@123';
        const hashedPassword = await bcrypt.hash(passwordPlain, 10);

        const newAdmin = {
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'admin',
            full_name: 'Global Admin',
            updatedAt: new Date(),
            createdAt: new Date()
        };

        const result = await users.updateOne(
            { email: newAdmin.email },
            { $set: newAdmin },
            { upsert: true }
        );

        if (result.upsertedCount > 0) {
            console.log('Successfully created global admin user.');
        } else {
            console.log('Successfully updated global admin user.');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
        process.exit(0);
    }
}

run();
