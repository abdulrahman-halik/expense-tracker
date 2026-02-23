import React from 'react';
import { User as UserIcon, Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../features/auth/hooks/useAuth';

interface HeaderProps {
    title: string;
    onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
    const { user } = useAuth();

    return (
        <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden p-2"
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5 text-gray-500" />
                </Button>
                <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 pl-2">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium text-gray-900 leading-none">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.role || 'Member'}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 cursor-pointer hover:bg-blue-200 transition-colors">
                        <UserIcon className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export { Header };
