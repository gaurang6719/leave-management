import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, Menu, LogOut, User, Lock, Settings, CheckCheck } from 'lucide-react';
import Avatar from '../common/Avatar';
import ThemeSwitch from '../common/ThemeSwitch';
import { logoutSuccess } from '../../redux/slices/authSlice';
import { logoutUser } from '../../services/auth.service';
import {
  fetchMyNotificationsList,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../services/notification.service';
import toast from 'react-hot-toast';

const Navbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications
  const loadNotifications = async () => {
    if (!user) return;
    try {
      const data = await fetchMyNotificationsList();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n) => !n.read).length);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    loadNotifications();
    // Poll notifications every 30 seconds for live updates
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkRead = async (id) => {
    try {
      const data = await markNotificationRead(id);
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const data = await markAllNotificationsRead();
      if (data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logoutSuccess());
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      dispatch(logoutSuccess());
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 px-4 sm:px-6 py-4 flex items-center justify-between select-none">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        {user && (
          <nav className="hidden lg:flex items-center gap-5 text-xs font-bold">
            {user.role === 'Super Admin' ? (
              <>
                <Link to="/admin/dashboard" className="text-zinc-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Dashboard
                </Link>
                <Link to="/admin/employees" className="text-zinc-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Employees
                </Link>
                <Link to="/admin/leaves" className="text-zinc-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Leave Requests
                </Link>
              </>
            ) : (
              <>
                <Link to="/employee/dashboard" className="text-zinc-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Dashboard
                </Link>
                <Link to="/employee/apply" className="text-zinc-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Apply Leave
                </Link>
                <Link to="/employee/history" className="text-zinc-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Leave History
                </Link>
              </>
            )}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitch />

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-all duration-200"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-zinc-200/40 dark:divide-zinc-800/40">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-500">
                    No new activity alerts
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => !n.read && handleMarkRead(n._id)}
                      className={`p-4 text-left transition-colors cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 ${
                        !n.read ? 'bg-brand-50/10 dark:bg-brand-900/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                            !n.read ? 'bg-brand-500' : 'bg-transparent'
                          }`}
                        />
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-zinc-950 dark:text-white">
                            {n.title}
                          </h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {n.description}
                          </p>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">
                            {new Date(n.createdAt).toLocaleDateString()} at{' '}
                            {new Date(n.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-200 focus:outline-none"
          >
            <Avatar name={user?.name} src={user?.avatar} size="sm" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2.5 w-52 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 py-1.5">
              <div className="px-4 py-2 border-b border-zinc-200/50 dark:border-zinc-800/50">
                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                  {user?.email}
                </p>
              </div>

              <Link
                to="/profile"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <User className="w-4 h-4" />
                My Profile
              </Link>
              <Link
                to="/change-password"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border-t border-zinc-200/50 dark:border-zinc-800/50 mt-1.5 pt-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
