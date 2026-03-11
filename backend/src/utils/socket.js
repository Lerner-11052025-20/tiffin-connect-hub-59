import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [process.env.FRONTEND_URL || 'http://localhost:8080', 'http://localhost:5173'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('⚡ User connected:', socket.id);

        socket.on('join', (userId) => {
            console.log(`👤 User ${userId} joined their notification room`);
            socket.join(userId);
        });

        socket.on('disconnect', () => {
            console.log('🔥 User disconnected');
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
