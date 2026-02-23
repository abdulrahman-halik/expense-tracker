import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import { protect, AuthRequest } from './middleware/authMiddleware';


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


app.get('/api/protected', protect, (req: AuthRequest, res: Response) => {
    res.json({
        success: true,
        message: 'You are authenticated!',
        user: req.user,
    });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
