import {
    PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Card } from '../ui/Card';

interface CategoryData {
    category: string;
    amount: number;
    color: string;
}

interface TrendData {
    month: string;
    income: number;
    expenses: number;
}

// Minimalist, premium 2-color sequential palette (e.g. deep indigo to light blue)
// This overrides the backend's rainbow colors for an "industrial" look.
const PIE_COLORS = ['#312e81', '#4338ca', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

export const CategoryPieChart = ({ data }: { data: CategoryData[] }) => {
    // Sort data to show largest first, making the sequential color drop-off look natural
    const sortedData = [...data].sort((a, b) => b.amount - a.amount);

    return (
        <Card className="p-6 h-[400px] flex flex-col shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100 font-inter tracking-tight">Expenses by Category</h3>
            {sortedData.length === 0 ? (
                <div className="flex-1 w-full flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
                    No expenses to show yet
                </div>
            ) : (
                <div className="flex-1 w-full flex items-center justify-center min-h-0">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={sortedData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="amount"
                                nameKey="category"
                                stroke="none"
                            >
                                {sortedData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index < 2 ? PIE_COLORS[index] : PIE_COLORS[index % PIE_COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    color: '#1e293b',
                                    fontSize: '13px',
                                    fontWeight: 500
                                }}
                                itemStyle={{ color: '#0f172a' }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </Card>
    );
};

export const SpendingTrendChart = ({ data }: { data: TrendData[] }) => {
    return (
        <Card className="p-6 h-[400px] flex flex-col shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100 font-inter tracking-tight">Income vs Expenses</h3>
            {data.length === 0 ? (
                <div className="flex-1 w-full flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
                    No transactions in the last 6 months
                </div>
            ) : (
                <div className="flex-1 w-full min-h-0 mt-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                tickFormatter={(value) => `$${value}`}
                                dx={-10}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    color: '#1e293b',
                                    fontSize: '13px',
                                    fontWeight: 500
                                }}
                            />
                            <Legend
                                verticalAlign="top"
                                align="right"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '13px', paddingBottom: '20px' }}
                            />
                            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </Card>
    );
};
