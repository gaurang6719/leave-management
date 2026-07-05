import React from 'react';

const ValidationMessage = ({ message, className = '' }) => {
  if (!message) return null;
  return (
    <span className={`text-xs text-rose-500 mt-1 block font-medium ${className}`}>
      {message}
    </span>
  );
};

export default ValidationMessage;
