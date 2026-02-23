import { BrowserRouter, Routes, Route } from 'react-router-dom';

const DashboardPlaceholder = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome to your Expense Tracker dashboard!</p>
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <p className="text-blue-700 font-medium">(Coming Soon: Analytics & Expense Overview)</p>
      </div>
    </div>
  </div>
);

const LoginPlaceholder = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Sign In</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="••••••••" />
        </div>
        <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-200">
          Sign In
        </button>
      </form>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPlaceholder />} />
        <Route path="/login" element={<LoginPlaceholder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
