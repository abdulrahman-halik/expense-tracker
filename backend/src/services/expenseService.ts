import Expense, { IExpense } from '../models/Expense';

export interface ExpenseFilters {
    category?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
    sortBy?: 'date' | 'amount';
    sortOrder?: 'asc' | 'desc';
}

export interface ExpenseData {
    title: string;
    amount: number;
    category: string;
    date?: Date;
    description?: string;
}

export interface PaginatedExpenses {
    data: IExpense[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
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


export const getExpensesByUser = async (
    userId: string,
    filters: ExpenseFilters = {}
): Promise<PaginatedExpenses> => {
    const query: Record<string, unknown> = { user: userId };

    // --- Filtering ---
    if (filters.category) {
        query.category = filters.category;
    }

    if (filters.startDate || filters.endDate) {
        const dateFilter: Record<string, Date> = {};
        if (filters.startDate) dateFilter.$gte = filters.startDate;
        if (filters.endDate) dateFilter.$lte = filters.endDate;
        query.date = dateFilter;
    }

    const sortField = filters.sortBy ?? 'date';
    const sortDirection = filters.sortOrder === 'asc' ? 1 : -1;
    const sortQuery: Record<string, 1 | -1> = { [sortField]: sortDirection };

    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 10));
    const skip = (page - 1) * limit;

    const [data, totalItems] = await Promise.all([
        Expense.find(query).sort(sortQuery).skip(skip).limit(limit),
        Expense.countDocuments(query),
    ]);

    return {
        data,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
    };
};

export const getExpenseById = async (id: string): Promise<IExpense | null> => {
    return Expense.findById(id);
};


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
