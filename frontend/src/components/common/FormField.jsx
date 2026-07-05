import React from 'react';
import FormLabel from './FormLabel';
import FormError from './FormError';

const FormField = ({
  label,
  htmlFor,
  required = false,
  error,
  children,
  className = '',
}) => {
  return (
    <div className={`mb-5 w-full ${className}`}>
      {label && (
        <FormLabel htmlFor={htmlFor} required={required}>
          {label}
        </FormLabel>
      )}
      {children}
      <FormError message={error} />
    </div>
  );
};

export default FormField;
