import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { getIO } from './socket.js';

export async function sendNotification(userId, data) {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        const settings = user.notificationSettings || { inApp: true, email: true, push: false };

        // 1. In-App Notification (Database)
        let savedNotification = null;
        if (settings.inApp) {
            savedNotification = await Notification.create({
                userId,
                ...data
            });

            // BROADCAST REAL-TIME OVER SOCKET
            try {
                const io = getIO();
                io.to(userId.toString()).emit('notification', {
                    ...savedNotification.toJSON(),
                    createdAt: savedNotification.createdAt
                });
                console.log(`📡 Socket emitted to user ${userId}`);
            } catch (err) {
                console.warn('Socket emit failed:', err.message);
            }
        }

        // 2. Email Notification (Mock)
        if (settings.email) {
            console.log(`[EMAIL DISPATCHED] To: ${user.email} | Subject: ${data.title}`);
        }

        // 3. Push Notification (Mock for PWA Web Push)
        if (settings.push) {
            console.log(`[PUSH DISPATCHED] To User: ${userId} | Message: ${data.message}`);
        }

        return savedNotification;
    } catch (err) {
        console.error('Failed to send notification:', err.message);
    }
}
