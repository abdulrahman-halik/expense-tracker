import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Receipt,
    Settings,
    LogOut,
    Wallet
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Receipt, label: 'Expenses', path: '/expenses' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Toggle Button - Moved to Header */}

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed top-0 left-0 z-40 h-screen transition-transform md:translate-x-0 border-r border-gray-200 bg-white w-64 flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Expensify
                        </span>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                    isActive
                                        ? "bg-blue-50 text-blue-600 shadow-sm"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-gray-100">
                    <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50 gap-3">
                        <LogOut className="h-5 w-5" />
                        Logout
                    </Button>
                </div>
            </aside>
        </>
    );
};

export { Sidebar };
