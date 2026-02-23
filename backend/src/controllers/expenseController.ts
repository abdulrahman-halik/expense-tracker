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


export const getExpenses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;

    const filters: ExpenseFilters = {};

    if (req.query.category) filters.category = req.query.category as string;
    if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
    if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);

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
};


export const createExpenseHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;
    const { title, amount, category, date, description } = req.body;

    const expense = await createExpense(userId, {
        title,
        amount,
        category,
        date: date ? new Date(date) : undefined,
        description,
    });

    res.status(201).json({
        success: true,
        message: 'Expense created successfully',
        data: expense,
    });
};


export const updateExpenseHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const existing = await getExpenseById(id);
    if (!existing) {
        return next(new AppError('Expense not found', 404));
    }

    if (existing.user.toString() !== userId) {
        return next(new AppError('Not authorised – you do not own this expense', 403));
    }

    const { title, amount, category, date, description } = req.body;

    const updated = await updateExpenseById(id, {
        title,
        amount,
        category,
        date: date ? new Date(date) : undefined,
        description,
    });

    res.status(200).json({
        success: true,
        message: 'Expense updated successfully',
        data: updated,
    });
};

export const deleteExpenseHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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
};
