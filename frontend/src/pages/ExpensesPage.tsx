import { useEffect, useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ExpenseTable } from '../components/expenses/ExpenseTable';
import { TransactionForm, type TransactionFormData } from '../components/expenses/TransactionForm';
import { DeleteConfirmationModal } from '../components/expenses/DeleteConfirmationModal';
import { Modal } from '../components/ui/Modal';
import expenseService from '../services/expenseService';
import type { Transaction, ExpenseFilters, Category, TransactionType } from '../types/expense';
import { toast } from 'react-hot-toast';
import { useCallback } from 'react';

const CATEGORIES: Category[] = [
    'Food', 'Transport', 'Rent', 'Salary', 'Utilities',
    'Entertainment', 'Shopping', 'Health', 'Education', 'Other'
];

const ExpensesPage = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [filters, setFilters] = useState<ExpenseFilters>({
        search: '',
        category: undefined,
        page: 1,
        limit: 10
    });

    const fetchTransactions = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await expenseService.getAllExpenses(filters);
            setTransactions(response.data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            toast.error('Failed to load transactions');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTransactions();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [fetchTransactions]);

    const handleAddTransaction = async (data: TransactionFormData) => {
        try {
            if (editingTransaction) {
                await expenseService.updateExpense(editingTransaction.id, data);
            } else {
                await expenseService.addExpense(data);
            }
            setIsAddModalOpen(false);
            setEditingTransaction(null);
            toast.success(editingTransaction ? 'Transaction updated' : 'Transaction added');
            fetchTransactions();
        } catch (error) {
            console.error('Operation failed:', error);
            toast.error('Operation failed');
        }
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await expenseService.deleteExpense(deletingId);
            setDeletingId(null);
            toast.success('Transaction deleted');
            fetchTransactions();
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Failed to delete transaction');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Transactions</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track and manage all your financial activities.</p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    leftIcon={<PlusCircle size={20} />}
                >
                    Add Transaction
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        placeholder="Search transactions..."
                        className="pl-10"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                </div>

                <select
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-950"
                    value={filters.category || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as Category || undefined }))}
                >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-950"
                    value={filters.type || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as TransactionType || undefined }))}
                >
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <div className="flex flex-col sm:flex-row gap-2 md:col-span-2">
                    <div className="flex-1">
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Start Date</label>
                        <Input
                            type="date"
                            value={filters.startDate || ''}
                            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value || undefined }))}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-medium text-slate-500 mb-1 block">End Date</label>
                        <Input
                            type="date"
                            value={filters.endDate || ''}
                            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value || undefined }))}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-[2]">
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Sort By</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-950"
                            value={filters.sortBy || 'date'}
                            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as 'date' | 'amount' | 'category' }))}
                        >
                            <option value="date">Date</option>
                            <option value="amount">Amount</option>
                            <option value="category">Category</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Order</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-950"
                            value={filters.sortOrder || 'desc'}
                            onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
                        >
                            <option value="desc">Desc</option>
                            <option value="asc">Asc</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({
                        search: '',
                        category: undefined,
                        type: undefined,
                        startDate: undefined,
                        endDate: undefined,
                        sortBy: 'date',
                        sortOrder: 'desc',
                        page: 1,
                        limit: 10
                    })}
                >
                    Clear Filters
                </Button>
            </div>

            {/* Transactions Table */}
            <div className="space-y-4">
                <ExpenseTable
                    transactions={transactions}
                    isLoading={isLoading}
                    onEdit={(t) => {
                        setEditingTransaction(t);
                        setIsAddModalOpen(true);
                    }}
                    onDelete={(id) => setDeletingId(id)}
                />

                {/* Pagination */}
                <div className="flex items-center justify-between bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-medium text-slate-900 dark:text-slate-100">{transactions.length}</span> transactions
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={filters.page === 1 || isLoading}
                            onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={transactions.length < (filters.limit || 10) || isLoading}
                            onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingTransaction(null);
                }}
                title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
            >
                <TransactionForm
                    initialData={editingTransaction || undefined}
                    onSubmit={handleAddTransaction}
                    onCancel={() => {
                        setIsAddModalOpen(false);
                        setEditingTransaction(null);
                    }}
                />
            </Modal>

            {/* Delete Confirmation */}
            <DeleteConfirmationModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default ExpensesPage;
