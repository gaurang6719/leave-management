import React from 'react';

const FormError = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <span className={`text-xs text-rose-500 mt-1.5 block font-medium animate-pulse ${className}`}>
      {message}
    </span>
  );
};

export default FormError;
