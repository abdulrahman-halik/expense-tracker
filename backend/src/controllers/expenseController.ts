import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { AppError } from '../middleware/errorMiddleware';
import {
    createExpense,
    getExpensesByUser,
    getExpenseById,
    updateExpenseById,
    deleteExpenseById,
    ExpenseFilters,
} from '../services/expenseService';
import Expense from '../models/Expense';


export const getExpenses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id;
        const filters: ExpenseFilters = {};

        if (req.query.category) filters.category = req.query.category as string;
        if (req.query.type) filters.type = req.query.type as 'income' | 'expense';
        if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
        if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);
        if (req.query.search) filters.title = req.query.search as string;


        // Pagination
        if (req.query.page) filters.page = Number(req.query.page);
        if (req.query.limit) filters.limit = Number(req.query.limit);

        // Sorting
        const sortBy = req.query.sortBy as string | undefined;
        if (sortBy === 'date' || sortBy === 'amount') filters.sortBy = sortBy;

        const sortOrder = req.query.sortOrder as string | undefined;
        if (sortOrder === 'asc' || sortOrder === 'desc') filters.sortOrder = sortOrder;

        const result = await getExpensesByUser(userId, filters);

        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (err) {
        next(err);
    }
};


export const createExpenseHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id;

        const expense = await createExpense(userId, req.body);

        res.status(201).json({
            success: true,
            message: 'Expense created successfully',
            data: expense,
        });
    } catch (err) {
        next(err);
    }
};


export const updateExpenseHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id;
        const id = req.params.id as string;

        const existing = await getExpenseById(id);
        if (!existing) {
            return next(new AppError('Expense not found', 404));
        }

        if (existing.user.toString() !== userId) {
            return next(new AppError('Not authorised – you do not own this expense', 403));
        }

        const { title, amount, category, type, date, note } = req.body;

        const updated = await updateExpenseById(id, {
            title,
            amount,
            category,
            type,
            date: date ? new Date(date) : undefined,
            note,
        });

        res.status(200).json({
            success: true,
            message: 'Expense updated successfully',
            data: updated,
        });
    } catch (err) {
        next(err);
    }
};


export const deleteExpenseHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id;
        const id = req.params.id as string;

        const existing = await getExpenseById(id);
        if (!existing) {
            return next(new AppError('Expense not found', 404));
        }

        if (existing.user.toString() !== userId) {
            return next(new AppError('Not authorised – you do not own this expense', 403));
        }

        await deleteExpenseById(id);

        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully',
        });
    } catch (err) {
        next(err);
    }
};


/**
 * GET /api/expenses/stats
 * Returns dashboard statistics for the authenticated user.
 */
export const getStatsHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id;

        // Determine current month boundaries
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const [monthlyIncome, monthlyExpenses, categoryData, recentTransactions, spendingTrend] = await Promise.all([
            // Monthly income
            Expense.aggregate([
                { $match: { user: existing_oid(userId), type: 'income', date: { $gte: startOfMonth, $lte: endOfMonth } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            // Monthly expenses
            Expense.aggregate([
                { $match: { user: existing_oid(userId), type: 'expense', date: { $gte: startOfMonth, $lte: endOfMonth } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            // Category breakdown (all-time)
            Expense.aggregate([
                { $match: { user: existing_oid(userId), type: 'expense' } },
                { $group: { _id: '$category', amount: { $sum: '$amount' } } },
                { $sort: { amount: -1 } },
            ]),
            // Recent transactions (last 5)
            Expense.find({ user: userId }).sort({ date: -1 }).limit(5),
            // Spending trend (last 6 months)
            Expense.aggregate([
                {
                    $match: {
                        user: existing_oid(userId),
                        date: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) },
                    },
                },
                {
                    $group: {
                        _id: { month: { $month: '$date' }, year: { $year: '$date' }, type: '$type' },
                        total: { $sum: '$amount' },
                    },
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
            ]),
        ]);

        const income = monthlyIncome[0]?.total ?? 0;
        const expenses = monthlyExpenses[0]?.total ?? 0;

        // Category colours (cycle through a fixed palette)
        const COLORS = ['#6366f1', '#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#ec4899', '#14b8a6', '#8b5cf6', '#f97316', '#64748b'];
        const categoryBreakdown = categoryData.map((c: any, i: number) => ({
            category: c._id,
            amount: c.amount,
            color: COLORS[i % COLORS.length],
        }));

        // Build spending trend map
        const trendMap: Record<string, { income: number; expenses: number }> = {};
        const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        spendingTrend.forEach((entry: any) => {
            const key = `${MONTHS[entry._id.month - 1]} ${entry._id.year}`;
            if (!trendMap[key]) trendMap[key] = { income: 0, expenses: 0 };
            if (entry._id.type === 'income') trendMap[key].income += entry.total;
            else trendMap[key].expenses += entry.total;
        });
        const spendingTrendArr = Object.entries(trendMap).map(([month, vals]) => ({ month, ...vals }));

        res.status(200).json({
            success: true,
            data: {
                totalBalance: income - expenses,
                monthlyIncome: income,
                monthlyExpenses: expenses,
                categoryBreakdown,
                spendingTrend: spendingTrendArr,
                recentTransactions,
            },
        });
    } catch (err) {
        next(err);
    }
};

// Helper: convert string userId to ObjectId for aggregation
import mongoose from 'mongoose';
function existing_oid(userId: string) {
    return new mongoose.Types.ObjectId(userId);
}
