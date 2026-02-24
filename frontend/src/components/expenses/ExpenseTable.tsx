import { Edit2, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Transaction } from '../../types/expense';
import { cn } from '../../utils/cn';
import { TableRowSkeleton } from '../ui/Skeleton';

interface ExpenseTableProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
    isLoading?: boolean;
}

export const ExpenseTable = ({ transactions, onEdit, onDelete, isLoading }: ExpenseTableProps) => {
    if (isLoading) {
        return (
            <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded"></div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-900">
                    <TableRowSkeleton columns={5} />
                    <TableRowSkeleton columns={5} />
                    <TableRowSkeleton columns={5} />
                    <TableRowSkeleton columns={5} />
                    <TableRowSkeleton columns={5} />
                </div>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="w-full py-12 flex flex-col items-center justify-center text-slate-500 bg-white dark:bg-slate-950 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-900 mb-4">
                    <ArrowDownCircle size={32} className="text-slate-400" />
                </div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">No transactions found</p>
                <p className="text-sm">Try adjusting your filters or add a new transaction.</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">Transaction</th>
                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">Category</th>
                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">Date</th>
                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100 text-right">Amount</th>
                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                    {transactions.map((t) => (
                        <tr key={t.id || t._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded-lg",
                                        t.type === 'income'
                                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                    )}>
                                        {t.type === 'income' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-slate-100">{t.title}</p>
                                        {t.note && <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{t.note}</p>}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                                    {t.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                {new Date(t.date).toLocaleDateString()}
                            </td>
                            <td className={cn(
                                "px-6 py-4 text-right font-semibold",
                                t.type === 'income' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            )}>
                                {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => onEdit(t)}>
                                        <Edit2 size={16} />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => onDelete((t.id || t._id) as string)} className="text-red-500 hover:text-red-600 dark:hover:text-red-400">
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
