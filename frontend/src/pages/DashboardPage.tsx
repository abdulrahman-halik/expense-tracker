import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}!</h2>
                    <p className="text-gray-500">Here's what's happening with your money today.</p>
                </div>
                <Button leftIcon={<Plus className="h-4 w-4" />}>Add Expense</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Total Balance" description="Your available funds" footer={<div className="text-sm text-green-600 font-medium">+2.5% from last month</div>}>
                    <div className="text-3xl font-bold text-gray-900">$12,450.00</div>
                </Card>
                <Card title="Monthly Income" description="Total earnings this month">
                    <div className="text-3xl font-bold text-blue-600">$5,200.00</div>
                </Card>
                <Card title="Monthly Expenses" description="Total spent this month">
                    <div className="text-3xl font-bold text-red-600">$2,100.00</div>
                </Card>
            </div>

            <Card title="Recent Transactions" description="A list of your latest expenses">
                <div className="py-8 text-center text-gray-500 italic">
                    (Expenses list implementation coming in Phase 3)
                </div>
            </Card>
        </div>
    );
};
