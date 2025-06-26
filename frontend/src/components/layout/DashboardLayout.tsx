import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  PawPrint, 
  Users, 
  Package, 
  HeartHandshake,
  ClipboardList,
  LogOut
} from 'lucide-react';

export function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <PawPrint className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">Refugio Cariño Animal</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{user?.name}</span>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-indigo-700 rounded-full"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white h-[calc(100vh-4rem)] shadow-lg">
          <nav className="mt-5 px-2">
            <Link
              to="/dashboard/animals"
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <PawPrint className="mr-3 h-6 w-6" />
              Animals
            </Link>
            <Link
              to="/dashboard/adoptions"
              className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Users className="mr-3 h-6 w-6" />
              Adoptions
            </Link>
            <Link
              to="/dashboard/inventory"
              className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Package className="mr-3 h-6 w-6" />
              Inventory
            </Link>
            <Link
              to="/dashboard/donations"
              className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <HeartHandshake className="mr-3 h-6 w-6" />
              Donations
            </Link>
            <Link
              to="/dashboard/monitoring"
              className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <ClipboardList className="mr-3 h-6 w-6" />
              Monitoring
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}