import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { initSocket } from './utils/socket.js';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';
import addressRoutes from './routes/addresses.js';
import vendorRoutes from './routes/vendors.js';
import menuRoutes from './routes/menus.js';
import subscriptionRoutes from './routes/subscriptions.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import adminRoutes from './routes/admin.js';
import reviewRoutes from './routes/reviews.js';
import notificationRoutes from './routes/notifications.js';
import plannerRoutes from './routes/planner.js';
import chatbotRoutes from './routes/chatbot.js';
import User from './models/User.js';

const app = express();
const server = createServer(app);
initSocket(server);

app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:8080', 'http://localhost:5173'],
    credentials: true,
}));
// Must capture rawBuffer directly to cryptographically verify Stripe webhooks
app.use(express.json({
    verify: (req, _res, buf) => {
        req.rawBody = buf;
    }
}));

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
    console.error('API Error:', err.message);

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ message: `Validation Error: ${messages.join(', ')}`, errors: err.errors });
    }
    // Handle Mongoose cast errors (invalid ObjectIds)
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ID: ${err.value}` });
    }

    res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB Atlas');

        // Seed Global Admin
        const adminEmail = 'adminglobal@gmail.com';
        const exists = await User.findOne({ email: adminEmail });
        if (!exists) {
            console.log('🛡️  Creating Global Admin account...');
            await User.create({
                email: adminEmail,
                password: 'Admin@123',
                full_name: 'Global Admin',
                role: 'admin'
            });
            console.log('🛡️  Global Admin created.');
        }

        server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });
