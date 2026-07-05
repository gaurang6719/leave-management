import React from 'react';

const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyState,
  className = '',
}) => {
  if (loading) {
    return (
      <div className="w-full bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 shadow-glass-light dark:shadow-glass-dark">
        <div className="w-full space-y-4 animate-pulse">
          <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full"></div>
          <div className="h-14 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg w-full"></div>
          <div className="h-14 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg w-full"></div>
          <div className="h-14 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg w-full"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return emptyState || (
      <div className="w-full bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-12 text-center text-zinc-500 shadow-glass-light dark:shadow-glass-dark">
        No records available.
      </div>
    );
  }

  return (
    <div className={`w-full bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-glass-light dark:shadow-glass-dark overflow-hidden ${className}`}>
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-max border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/20">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 ${col.headerClassName || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
            {data.map((row, rowIdx) => (
              <tr
                key={row._id || rowIdx}
                className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 transition-colors duration-150"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300 font-medium ${col.cellClassName || ''}`}
                  >
                    {col.render ? col.render(row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
