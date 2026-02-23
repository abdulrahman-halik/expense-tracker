import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Transaction, Category } from '../../types/expense';

const transactionSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(50, 'Title must be less than 50 characters'),
    amount: z.number().positive('Amount must be greater than 0'),
    category: z.string().min(1, 'Category is required'),
    date: z.string().min(1, 'Date is required'),
    type: z.enum(['income', 'expense']),
    note: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
    initialData?: Transaction;
    onSubmit: (data: TransactionFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const CATEGORIES: Category[] = [
    'Food', 'Transport', 'Rent', 'Salary', 'Utilities',
    'Entertainment', 'Shopping', 'Health', 'Education', 'Other'
];

export const TransactionForm = ({ initialData, onSubmit, onCancel, isLoading }: TransactionFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: initialData ? {
            title: initialData.title,
            amount: initialData.amount,
            category: initialData.category,
            date: initialData.date.split('T')[0], // Extract YYYY-MM-DD
            type: initialData.type,
            note: initialData.note || '',
        } : {
            type: 'expense' as const,
            date: new Date().toISOString().split('T')[0],
            title: '',
            amount: 0,
            category: '',
            note: '',
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <Input
                        label="Title"
                        placeholder="e.g., Grocery Shopping"
                        {...register('title')}
                        error={errors.title?.message}
                    />
                </div>

                <Input
                    label="Amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('amount', { valueAsNumber: true })}
                    error={errors.amount?.message}
                />

                <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Type
                    </label>
                    <select
                        {...register('type')}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950"
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
                </div>

                <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Category
                    </label>
                    <select
                        {...register('category')}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950"
                    >
                        <option value="">Select Category</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                </div>

                <Input
                    label="Date"
                    type="date"
                    {...register('date')}
                    error={errors.date?.message}
                />
            </div>

            <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Note (Optional)
                </label>
                <textarea
                    {...register('note')}
                    rows={3}
                    className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950"
                    placeholder="Add some details..."
                />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {initialData ? 'Update' : 'Add'} Transaction
                </Button>
            </div>
        </form>
    );
};
