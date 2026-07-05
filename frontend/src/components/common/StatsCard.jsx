import React from 'react';
import Card from './Card';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend, // { type: 'up' | 'down', value: '12%' } or string
  trendText,
  color = 'brand', // brand, emerald, amber, rose, violet
}) => {
  const colorSchemes = {
    brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  };

  return (
    <Card hoverEffect className="relative flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${colorSchemes[color] || colorSchemes.brand}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {value}
        </h3>
        {trend && (
          <div className="flex items-center mt-2 space-x-1.5">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                trend.type === 'up'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend.type === 'up' ? '+' : ''}
              {trend.value}
            </span>
            {trendText && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                {trendText}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;
