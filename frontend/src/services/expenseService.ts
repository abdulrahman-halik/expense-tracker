import api from './api';
import type {
    Transaction,
    ExpenseFilters,
    DashboardStats,
    PaginatedResponse
} from '../types/expense';

const expenseService = {
    getAllExpenses: async (params?: ExpenseFilters): Promise<PaginatedResponse<Transaction>> => {
        const response = await api.get('/expenses', { params });
        return response.data;
    },

    getExpenseById: async (id: string): Promise<Transaction> => {
        const response = await api.get(`/expenses/${id}`);
        return response.data?.data || response.data;
    },

    addExpense: async (data: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> => {
        const response = await api.post('/expenses', data);
        return response.data?.data || response.data;
    },

    updateExpense: async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
        const response = await api.put(`/expenses/${id}`, data);
        return response.data?.data || response.data;
    },

    deleteExpense: async (id: string): Promise<void> => {
        await api.delete(`/expenses/${id}`);
    },

    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await api.get('/expenses/stats');
        return response.data?.data || response.data;
    }
};

export default expenseService;
