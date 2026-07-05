import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Input from './Input';

const PasswordInput = React.forwardRef(({
  name,
  id,
  placeholder = '••••••••',
  value,
  onChange,
  onBlur,
  disabled = false,
  error = false,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        error={error}
        icon={Lock}
        className={`pr-10 ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={togglePassword}
        disabled={disabled}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-350 focus:outline-none transition-colors"
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
