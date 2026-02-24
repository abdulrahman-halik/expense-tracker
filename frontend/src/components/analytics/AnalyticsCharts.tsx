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

export const CategoryPieChart = ({ data }: { data: CategoryData[] }) => {
    return (
        <Card className="p-6 h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">Expenses by Category</h3>
            {data.length === 0 ? (
                <div className="flex-1 w-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                    No expenses to show yet
                </div>
            ) : (
                <div className="flex-1 w-full flex items-center justify-center min-h-0">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="amount"
                                nameKey="category"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </Card>
    );
};

export const SpendingTrendChart = ({ data }: { data: TrendData[] }) => {
    return (
        <Card className="p-6 h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">Income vs Expenses</h3>
            {data.length === 0 ? (
                <div className="flex-1 w-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                    No transactions in the last 6 months
                </div>
            ) : (
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Legend verticalAlign="top" align="right" height={36} />
                            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </Card>
    );
};
