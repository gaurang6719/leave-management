import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import Login from './pages/login';
import Register from './pages/register';
import AdminDashboard from './pages/admin/Dashboard';
import Employees from './pages/admin/Employees';
import AdminLeaves from './pages/admin/Leaves';
import EmployeeDashboard from './pages/employee/Dashboard';
import ApplyLeave from './pages/employee/ApplyLeave';
import LeaveHistory from './pages/employee/LeaveHistory';
import Profile from './pages/shared/Profile';
import ChangePassword from './pages/shared/ChangePassword';

import {
  ProtectedRoute,
  PublicRoute,
  DashboardLayout,
} from './routes';
import { ROLES } from './constants';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Redirect root path to correct dashboard based on auth status and roles
  const getRootRedirect = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return user?.role === ROLES.SUPER_ADMIN ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/employee/dashboard" replace />
    );
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl shadow-xl',
          duration: 4000,
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Dashboard Layout Routes */}
        <Route
          element={
            <DashboardLayout
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        >
          {/* Shared Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>

          {/* Super Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/employees" element={<Employees />} />
            <Route path="/admin/leaves" element={<AdminLeaves />} />
          </Route>

          {/* Employee Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]} />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/apply" element={<ApplyLeave />} />
            <Route path="/employee/history" element={<LeaveHistory />} />
          </Route>
        </Route>

        {/* Root Redirect Catch-all */}
        <Route path="/" element={getRootRedirect()} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
