import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import expenseRoutes from './routes/expenseRoutes';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Public Routes
app.get('/', (_req: Request, res: Response) => {
    res.json({ success: true, message: 'Expense Tracker API is running...' });
});

// Auth routes: /api/auth/register  &  /api/auth/login
app.use('/api/auth', authRoutes);

// Expense routes: /api/expenses
app.use('/api/expenses', expenseRoutes);

// 404 handler – catches unmatched routes
app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Centralised error handler (must be last)
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
