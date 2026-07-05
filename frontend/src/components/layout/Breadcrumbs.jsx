import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on login page
  if (location.pathname === '/login') return null;

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-6 select-none font-medium">
      <Link
        to="/"
        className="flex items-center hover:text-zinc-800 dark:hover:text-white transition-colors"
      >
        <Home className="w-3.5 h-3.5 mr-1" />
        Portal
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = value
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-zinc-500 shrink-0" />
            {isLast ? (
              <span className="text-zinc-800 dark:text-white font-semibold truncate max-w-[120px] sm:max-w-none">
                {formattedName}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-zinc-800 dark:hover:text-white transition-colors truncate max-w-[120px] sm:max-w-none"
              >
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
