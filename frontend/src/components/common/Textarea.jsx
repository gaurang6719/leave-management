import React from 'react';

const Textarea = React.forwardRef(({
  name,
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  rows = 4,
  disabled = false,
  error = false,
  className = '',
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      name={name}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      rows={rows}
      disabled={disabled}
      className={`block w-full rounded-lg border bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:relative focus:z-10 disabled:opacity-50 disabled:bg-zinc-50 dark:disabled:bg-zinc-950/20 px-3 py-2 ${
        error ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-zinc-300 dark:border-zinc-700'
      } ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
