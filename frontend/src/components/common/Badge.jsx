import React from 'react';

const Badge = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20',
    info: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20',
    neutral: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700',
    purple: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/20',
  };

  const getStyleByValue = (val) => {
    if (!val) return variants.neutral;
    const lower = val.toLowerCase();
    
    if (lower === 'pending') return variants.warning;
    if (lower === 'approved') return variants.success;
    if (lower === 'rejected') return variants.danger;
    if (lower === 'cancelled') return variants.neutral;
    if (lower === 'super admin') return variants.purple;
    if (lower === 'employee') return variants.info;

    return variants.neutral;
  };

  const selectedStyle = typeof children === 'string' ? getStyleByValue(children) : variants[variant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${selectedStyle} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
