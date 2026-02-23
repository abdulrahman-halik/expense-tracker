import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

const MainLayout: React.FC = () => {
    const location = useLocation();

    // Map paths to titles
    const getPageTitle = (path: string) => {
        switch (path) {
            case '/': return 'Dashboard';
            case '/expenses': return 'Expenses';
            case '/settings': return 'Settings';
            default: return 'Expense Tracker';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 md:ml-64 flex flex-col">
                <Header title={getPageTitle(location.pathname)} />
                <main className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export { MainLayout };
