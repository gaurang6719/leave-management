import React from 'react';

const FormLabel = ({ children, htmlFor, className = '', required = false }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 ${className}`}
    >
      {children}
      {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
    </label>
  );
};

export default FormLabel;
