import app from './app';
import connectDB from './config/db';
import mongoose from 'mongoose';
import { Server } from 'http';

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`FATAL ERROR: Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
}

const PORT = process.env.PORT || 5000;
let server: Server;

const startServer = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await connectDB();

        server = app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    } catch (error: any) {
        console.error('\n❌ FATAL: Could not connect to MongoDB. Server startup aborted.');
        console.error(`Reason: ${error.message}`);
        console.error('\n💡 Troubleshooting hint:');
        console.error('   Make sure your Docker MongoDB container is running:');
        console.error('   $ cd ~/db-docker && docker compose up -d mongodb\n');
        process.exit(1);
    }
};

const gracefulShutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
    if (server) {
        server.close(async () => {
            console.log('HTTP server closed.');
            await mongoose.connection.close();
            console.log('MongoDB connection closed.');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
