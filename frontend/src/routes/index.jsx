import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROLES } from '../constants';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

// Protection for routes: Redirects to login if not authenticated, or to dashboard if role mismatch
export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Role mismatch: redirect to their respective dashboard
    const redirectPath =
      user.role === ROLES.SUPER_ADMIN ? '/admin/dashboard' : '/employee/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

// Route protection for Public routes: redirect authenticated users to their dashboard
export const PublicRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user) {
    const redirectPath =
      user.role === ROLES.SUPER_ADMIN ? '/admin/dashboard' : '/employee/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

// Main Layout wrapping the Sidebar, Navbar, and Content Viewports
export const DashboardLayout = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-200 flex transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
