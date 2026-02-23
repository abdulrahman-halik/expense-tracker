export type TransactionType = 'income' | 'expense';

export type Category =
    | 'Food'
    | 'Transport'
    | 'Rent'
    | 'Salary'
    | 'Utilities'
    | 'Entertainment'
    | 'Shopping'
    | 'Health'
    | 'Education'
    | 'Other';

export interface Transaction {
    id: string;
    _id?: string;
    title: string;
    amount: number;
    category: Category;
    date: string;
    note?: string;
    type: TransactionType;
    createdAt: string;
}

export interface ExpenseFilters {
    search?: string;
    category?: Category;
    type?: TransactionType;
    startDate?: string;
    endDate?: string;
    sortBy?: 'date' | 'amount' | 'category';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface DashboardStats {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    categoryBreakdown: {
        category: Category;
        amount: number;
        color: string;
    }[];
    spendingTrend: {
        month: string;
        income: number;
        expenses: number;
    }[];
    recentTransactions: Transaction[];
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
