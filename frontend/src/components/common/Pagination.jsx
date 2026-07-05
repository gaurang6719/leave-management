import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({
  page = 1,
  pages = 1,
  total = 0,
  limit = 10,
  onPageChange,
  className = '',
}) => {
  if (pages <= 1) return null;

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-1 ${className}`}>
      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
        Showing <span className="font-semibold text-zinc-800 dark:text-white">{startRecord}</span> to{' '}
        <span className="font-semibold text-zinc-800 dark:text-white">{endRecord}</span> of{' '}
        <span className="font-semibold text-zinc-800 dark:text-white">{total}</span> records
      </span>

      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
          // Display current page, first, last, and immediate surrounding pages
          if (p === 1 || p === pages || (p >= page - 1 && p <= page + 1)) {
            return (
              <Button
                key={p}
                variant={p === page ? 'primary' : 'outline'}
                size="sm"
                className="w-8 h-8 !p-0"
                onClick={() => onPageChange(p)}
              >
                {p}
              </Button>
            );
          } else if (p === page - 2 || p === page + 2) {
            return (
              <span
                key={p}
                className="px-2 text-zinc-400 dark:text-zinc-500 text-xs font-semibold select-none"
              >
                ...
              </span>
            );
          }
          return null;
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
