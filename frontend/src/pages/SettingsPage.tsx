import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../features/auth/hooks/useAuth';

export const SettingsPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <Card title="Profile Information" description="Update your personal details">
                <div className="space-y-4 max-w-md">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 border rounded-lg bg-gray-50">
                            <p className="text-xs text-gray-500 font-medium uppercase">Name</p>
                            <p className="font-medium">{user?.name || 'N/A'}</p>
                        </div>
                        <div className="p-3 border rounded-lg bg-gray-50">
                            <p className="text-xs text-gray-500 font-medium uppercase">Role</p>
                            <p className="font-medium">{user?.role || 'Member'}</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">Edit Profile</Button>
                </div>
            </Card>
        </div>
    );
};
