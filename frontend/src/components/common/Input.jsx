import React from 'react';

const Input = React.forwardRef(({
  type = 'text',
  name,
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  error = false,
  className = '',
  icon: Icon,
  onClick,
  ...props
}, ref) => {
  return (
    <div className="relative rounded-lg shadow-sm w-full">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        ref={ref}
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        onClick={(e) => {
          if (type === 'date' && typeof e.target.showPicker === 'function') {
            try {
              e.target.showPicker();
            } catch (err) {
              // ignore
            }
          }
          if (onClick) onClick(e);
        }}
        className={`block w-full rounded-lg border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-500 focus:border-transparent focus:relative focus:z-10 disabled:opacity-50 disabled:bg-zinc-50 dark:disabled:bg-zinc-950/20 ${
          Icon ? 'pl-10' : 'pl-3'
        } ${error ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-zinc-300 dark:border-zinc-700'} ${className}`}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
