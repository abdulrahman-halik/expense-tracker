import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';

export const ExpensesPage: React.FC = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
            <Button leftIcon={<Plus className="h-4 w-4" />}>New Transaction</Button>
        </div>
        <Card>
            <div className="py-20 text-center text-gray-500">
                <Plus className="h-10 w-10 mx-auto mb-4 opacity-20" />
                <p>No expenses track yet. Click the button above to add one!</p>
            </div>
        </Card>
    </div>
);
