import api from './api';
import type {
    Transaction,
    ExpenseFilters,
    DashboardStats,
    PaginatedResponse
} from '../types/expense';

const expenseService = {
    getAllExpenses: async (params?: ExpenseFilters): Promise<PaginatedResponse<Transaction>> => {
        const response = await api.get('/transactions', { params });
        return response.data;
    },

    getExpenseById: async (id: string): Promise<Transaction> => {
        const response = await api.get(`/transactions/${id}`);
        return response.data;
    },

    addExpense: async (data: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> => {
        const response = await api.post('/transactions', data);
        return response.data;
    },

    updateExpense: async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
        const response = await api.put(`/transactions/${id}`, data);
        return response.data;
    },

    deleteExpense: async (id: string): Promise<void> => {
        await api.delete(`/transactions/${id}`);
    },

    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await api.get('/transactions/stats');
        return response.data;
    }
};

export default expenseService;
