import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

const ThemeSwitch = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-all duration-200 ${className}`}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="w-5 h-5 transition-transform rotate-0 scale-100" />
      )}
    </button>
  );
};

export default ThemeSwitch;
