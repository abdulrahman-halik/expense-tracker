import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Plus } from 'lucide-react';

const DashboardPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, Abdul!</h2>
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

const ExpensesPage = () => (
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

const SettingsPage = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
    <Card title="Profile Information" description="Update your personal details">
      <div className="space-y-4 max-w-md">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border rounded-lg bg-gray-50">
            <p className="text-xs text-gray-500 font-medium uppercase">Name</p>
            <p className="font-medium">Abdul</p>
          </div>
          <div className="p-3 border rounded-lg bg-gray-50">
            <p className="text-xs text-gray-500 font-medium uppercase">Role</p>
            <p className="font-medium">Member</p>
          </div>
        </div>
        <Button variant="outline" size="sm">Edit Profile</Button>
      </div>
    </Card>
  </div>
);

const LoginPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
    <Card className="w-full max-w-md shadow-2xl border-0 ring-1 ring-gray-200" title="Sign In" description="Enter your credentials to access your account">
      <form className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all" placeholder="you@example.com" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input type="password" className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all" placeholder="••••••••" />
          </div>
        </div>
        <Button className="w-full mt-4">Sign In</Button>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">Don't have an account? <span className="text-blue-600 font-medium cursor-pointer hover:underline">Sign up</span></p>
        </div>
      </form>
    </Card>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
