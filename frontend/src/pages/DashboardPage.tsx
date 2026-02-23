import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, PlusCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CategoryPieChart, SpendingTrendChart } from '../components/analytics/AnalyticsCharts';
import { ExpenseTable } from '../components/expenses/ExpenseTable';
import { CardSkeleton, Skeleton } from '../components/ui/Skeleton';
import { TransactionForm } from '../components/expenses/TransactionForm';
import { Modal } from '../components/ui/Modal';
import expenseService from '../services/expenseService';
import type { DashboardStats } from '../types/expense';
import { toast } from 'react-hot-toast';

const StatCard = ({ title, amount, icon: Icon, color, trend }: any) => (
    <Card className="flex flex-col p-6">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600 dark:bg-${color}-900/30 dark:text-${color}-400`}>
                <Icon size={24} />
            </div>
            {trend && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
    </Card>
);

const DashboardPage = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            const data = await expenseService.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleAddTransaction = async (data: any) => {
        try {
            await expenseService.addExpense(data);
            setIsModalOpen(false);
            toast.success('Transaction added');
            fetchStats();
        } catch (error) {
            console.error('Failed to add transaction:', error);
            toast.error('Failed to add transaction');
        }
    };

    if (isLoading && !stats) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded mb-2"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-64 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="flex-1 w-full" />
                    </div>
                    <div className="h-64 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="flex-1 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening today.</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    leftIcon={<PlusCircle size={20} />}
                    className="hidden md:flex"
                >
                    Add Transaction
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Balance"
                    amount={stats?.totalBalance || 0}
                    icon={Wallet}
                    color="blue"
                />
                <StatCard
                    title="Monthly Income"
                    amount={stats?.monthlyIncome || 0}
                    icon={TrendingUp}
                    color="green"
                />
                <StatCard
                    title="Monthly Expenses"
                    amount={stats?.monthlyExpenses || 0}
                    icon={TrendingDown}
                    color="red"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SpendingTrendChart data={stats?.spendingTrend || []} />
                <CategoryPieChart data={stats?.categoryBreakdown || []} />
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Activity</h2>
                    <Button variant="outline" size="sm">View All</Button>
                </div>
                <ExpenseTable
                    transactions={stats?.recentTransactions || []}
                    onEdit={() => { }}
                    onDelete={() => { }}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Transaction"
            >
                <TransactionForm
                    onSubmit={handleAddTransaction}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default DashboardPage;
