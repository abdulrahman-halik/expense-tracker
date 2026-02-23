import Expense, { IExpense } from '../models/Expense';

export interface ExpenseFilters {
    category?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface ExpenseData {
    title: string;
    amount: number;
    category: string;
    date?: Date;
    description?: string;
}

/**
 * Create a new expense linked to a user.
 */
export const createExpense = async (
    userId: string,
    data: ExpenseData
): Promise<IExpense> => {
    return Expense.create({
        title: data.title.trim(),
        amount: data.amount,
        category: data.category.trim(),
        date: data.date ?? new Date(),
        description: data.description?.trim(),
        user: userId,
    });
};

/**
 * Get all expenses for a specific user, with optional filtering.
 * Results sorted by date descending (newest first).
 */
export const getExpensesByUser = async (
    userId: string,
    filters: ExpenseFilters = {}
): Promise<IExpense[]> => {
    const query: Record<string, unknown> = { user: userId };

    if (filters.category) {
        query.category = filters.category;
    }

    if (filters.startDate || filters.endDate) {
        const dateFilter: Record<string, Date> = {};
        if (filters.startDate) dateFilter.$gte = filters.startDate;
        if (filters.endDate) dateFilter.$lte = filters.endDate;
        query.date = dateFilter;
    }

    return Expense.find(query).sort({ date: -1 });
};

/**
 * Get a single expense by its ID (does not check ownership here).
 */
export const getExpenseById = async (id: string): Promise<IExpense | null> => {
    return Expense.findById(id);
};

/**
 * Update an expense by ID and return the updated document.
 */
export const updateExpenseById = async (
    id: string,
    data: Partial<ExpenseData>
): Promise<IExpense | null> => {
    const updateFields: Partial<IExpense> = {};
    if (data.title !== undefined) updateFields.title = data.title.trim();
    if (data.amount !== undefined) updateFields.amount = data.amount;
    if (data.category !== undefined) updateFields.category = data.category.trim();
    if (data.date !== undefined) updateFields.date = data.date;
    if (data.description !== undefined) updateFields.description = data.description.trim();

    return Expense.findByIdAndUpdate(id, { $set: updateFields }, { new: true, runValidators: true });
};

/**
 * Delete an expense by ID.
 */
export const deleteExpenseById = async (id: string): Promise<IExpense | null> => {
    return Expense.findByIdAndDelete(id);
};
