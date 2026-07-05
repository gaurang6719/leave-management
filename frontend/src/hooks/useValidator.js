import { useState, useRef } from 'react';
import SimpleReactValidator from 'simple-react-validator';

const useValidator = (customOptions = {}) => {
  const [, setUpdateCount] = useState(0);
  const forceUpdate = () => setUpdateCount((prev) => prev + 1);

  const validatorRef = useRef(
    new SimpleReactValidator({
      className: 'text-xs text-rose-500 mt-1 block',
      messages: {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        min: 'Must be at least :min characters',
        max: 'Must not exceed :max characters',
      },
      ...customOptions,
    })
  );

  const validator = validatorRef.current;

  // Validate fields on submit: returns true if valid, triggers messages re-render if not
  const validateAll = () => {
    const valid = validator.allValid();
    if (!valid) {
      validator.showMessages();
      forceUpdate();
    }
    return valid;
  };

  // Run validation on a specific field blur / change
  const validateField = (field, value) => {
    validator.showMessageFor(field);
    forceUpdate();
  };

  // Clear all validation errors
  const resetValidation = () => {
    validator.hideMessages();
    forceUpdate();
  };

  return {
    validator,
    validateAll,
    validateField,
    resetValidation,
    forceUpdate,
  };
};

export default useValidator;
