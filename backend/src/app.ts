import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import expenseRoutes from './routes/expenseRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import { protect } from './middleware/authMiddleware';

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());

// Standard Middleware
app.use(cors());
app.use(express.json());

// Rate Limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Public Routes
app.get('/', (_req: Request, res: Response) => {
    res.json({ success: true, message: 'Expense Tracker API is running...' });
});

// Auth routes
app.use('/api/auth', authLimiter, authRoutes);

// Expense routes
app.use('/api/expenses', protect, expenseRoutes);

app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

export default app;
