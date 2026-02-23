import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
    createExpense,
    getExpensesByUser,
    getExpenseById,
    updateExpenseById,
    deleteExpenseById,
    ExpenseFilters,
} from '../services/expenseService';

/**
 * GET /api/expenses
 * Return all expenses belonging to the authenticated user.
 * Supports optional query params: category, startDate, endDate
 */
export const getExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const filters: ExpenseFilters = {};
    if (req.query.category) filters.category = req.query.category as string;
    if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
    if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);

    const expenses = await getExpensesByUser(userId, filters);

    res.status(200).json({
        success: true,
        count: expenses.length,
        data: expenses,
    });
};

/**
 * POST /api/expenses
 * Create a new expense for the authenticated user.
 */
export const createExpenseHandler = async (req: AuthRequest, res: Response): Promise<void> => {
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

/**
 * PUT /api/expenses/:id
 * Update an expense. Only the owner may update their own expense.
 */
export const updateExpenseHandler = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const id = req.params.id as string;

    // Fetch and verify ownership
    const existing = await getExpenseById(id);
    if (!existing) {
        res.status(404).json({ success: false, message: 'Expense not found' });
        return;
    }

    if (existing.user.toString() !== userId) {
        res.status(403).json({ success: false, message: 'Not authorised – you do not own this expense' });
        return;
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

/**
 * DELETE /api/expenses/:id
 * Delete an expense. Only the owner may delete their own expense.
 */
export const deleteExpenseHandler = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const id = req.params.id as string;

    // Fetch and verify ownership
    const existing = await getExpenseById(id);
    if (!existing) {
        res.status(404).json({ success: false, message: 'Expense not found' });
        return;
    }

    if (existing.user.toString() !== userId) {
        res.status(403).json({ success: false, message: 'Not authorised – you do not own this expense' });
        return;
    }

    await deleteExpenseById(id);

    res.status(200).json({
        success: true,
        message: 'Expense deleted successfully',
    });
};
