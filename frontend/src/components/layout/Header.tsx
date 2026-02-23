import React from 'react';
import { User as UserIcon, Bell, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../features/auth/hooks/useAuth';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
            <h1 className="text-lg font-bold text-gray-900 pl-12 md:pl-0 truncate">{title}</h1>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="relative p-2">
                    <Bell className="h-5 w-5 text-gray-500" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
                </Button>
                <div className="h-8 w-px bg-gray-200 mx-1" />
                <div className="flex items-center gap-3 pl-2">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium text-gray-900 leading-none">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.role || 'Member'}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 cursor-pointer hover:bg-blue-200 transition-colors">
                        <UserIcon className="h-5 w-5" />
                    </div>
                </div>
                <div className="h-8 w-px bg-gray-200 mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                    title="Logout"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
};

export { Header };
