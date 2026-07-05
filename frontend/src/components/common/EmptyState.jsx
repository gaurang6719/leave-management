import React from 'react';
import { Archive } from 'lucide-react';
import Card from './Card';

const EmptyState = ({
  title = 'No records found',
  description = 'There is no data to display here at the moment.',
  icon: Icon = Archive,
  action,
}) => {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-12 bg-zinc-50/50 dark:bg-zinc-950/20 border-dashed border-2">
      <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400 dark:text-zinc-500">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
};

export default EmptyState;
