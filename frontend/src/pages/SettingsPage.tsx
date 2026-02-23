import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../features/auth/hooks/useAuth';
import { authService } from '../services/authService';

export const SettingsPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await authService.updateProfile({ name, email });
            updateUser(response.user);
            setIsEditing(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setIsEditing(false);
        setError(null);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <Card title="Profile Information" description="Update your personal details">
                <div className="space-y-4 max-w-md">
                    {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

                    {isEditing ? (
                        <div className="space-y-4">
                            <Input
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                            <div className="flex space-x-3">
                                <Button onClick={handleSave} disabled={isLoading} size="sm">
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button variant="outline" onClick={handleCancel} disabled={isLoading} size="sm">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 border rounded-lg bg-gray-50">
                                    <p className="text-xs text-gray-500 font-medium uppercase">Name</p>
                                    <p className="font-medium">{user?.name || 'N/A'}</p>
                                </div>
                                <div className="p-3 border rounded-lg bg-gray-50">
                                    <p className="text-xs text-gray-500 font-medium uppercase">Email</p>
                                    <p className="font-medium truncate">{user?.email || 'N/A'}</p>
                                </div>
                                <div className="p-3 border rounded-lg bg-gray-50 col-span-2">
                                    <p className="text-xs text-gray-500 font-medium uppercase">Role</p>
                                    <p className="font-medium">{user?.role || 'Member'}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
