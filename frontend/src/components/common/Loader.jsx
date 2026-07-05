import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ type = 'spinner', count = 3 }) => {
  if (type === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[250px] space-y-4">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider animate-pulse">
          Loading portal data...
        </span>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full"></div>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="h-14 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-full"></div>
        ))}
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50"></div>
        ))}
      </div>
    );
  }

  return null;
};

export default Loader;
