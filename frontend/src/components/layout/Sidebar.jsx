import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileSpreadsheet,
  User,
  Lock,
  LogOut,
  X,
  Sparkles,
} from 'lucide-react';
import { ROLES } from '../../constants';
import { logoutSuccess } from '../../redux/slices/authSlice';
import { logoutUser } from '../../services/auth.service';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logoutSuccess());
      toast.success('Logged out successfully');
      navigate('/login');
      onClose();
    } catch (err) {
      dispatch(logoutSuccess());
      navigate('/login');
      onClose();
    }
  };

  const getNavItems = () => {
    if (!user) return [];

    if (user.role === ROLES.SUPER_ADMIN) {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Employees', path: '/admin/employees', icon: Users },
        { name: 'Leave Requests', path: '/admin/leaves', icon: CalendarDays },
        { name: 'My Profile', path: '/profile', icon: User },
        { name: 'Change Password', path: '/change-password', icon: Lock },
      ];
    }

    return [
      { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
      { name: 'Apply Leave', path: '/employee/apply', icon: FileSpreadsheet },
      { name: 'Leave History', path: '/employee/history', icon: CalendarDays },
      { name: 'My Profile', path: '/profile', icon: User },
      { name: 'Change Password', path: '/change-password', icon: Lock },
    ];
  };

  const navItems = getNavItems();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-zinc-200/50 dark:border-zinc-800/50 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
            LeaveFlow
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Card */}
      <div className="px-5 py-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/40 dark:bg-zinc-950/20">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm uppercase">
            {user?.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              <item.icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-brand-500' : 'text-zinc-400 dark:text-zinc-500'
                }`}
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed inset-y-0 left-0 z-30 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Slide */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-zinc-950/40 dark:bg-zinc-950/70 backdrop-blur-sm"
            />
            {/* Slide content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-64 max-w-xs h-full z-10 flex flex-col"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
