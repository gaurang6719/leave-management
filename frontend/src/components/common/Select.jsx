import React, { useState, useRef, useEffect } from 'react';
import Popup from 'reactjs-popup';
import { ChevronDown } from 'lucide-react';

const Select = ({
  name,
  id,
  options = [],
  value,
  onChange,
  onBlur,
  disabled = false,
  error = false,
  borderless = false,
  placeholder = 'Select option',
  className = '',
}) => {
  const triggerRef = useRef(null);
  const [triggerWidth, setTriggerWidth] = useState('auto');

  // Function to measure and update width of trigger button
  const updateWidth = () => {
    if (triggerRef.current) {
      setTriggerWidth(`${triggerRef.current.getBoundingClientRect().width}px`);
    }
  };

  useEffect(() => {
    updateWidth();
    // Add small delay to ensure rendering completes
    const timer = setTimeout(updateWidth, 100);
    window.addEventListener('resize', updateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Resolve currently selected option's label
  const getSelectedLabel = () => {
    const selectedOption = options.find((opt) => {
      const val = typeof opt === 'object' ? opt.value : opt;
      return String(val) === String(value);
    });

    if (selectedOption) {
      return typeof selectedOption === 'object' ? selectedOption.label : selectedOption;
    }
    return placeholder;
  };

  const handleSelect = (optionVal, close) => {
    close();
    if (onChange) {
      onChange({
        target: {
          name,
          value: optionVal,
        },
      });
    }
    if (onBlur) {
      onBlur({
        target: {
          name,
          value: optionVal,
        },
      });
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={triggerRef}>
      <Popup
        trigger={
          <button
            type="button"
            id={id}
            disabled={disabled}
            onClick={updateWidth}
            className={`w-full flex items-center justify-between transition-all duration-200 focus:outline-none disabled:opacity-50 select-none cursor-pointer ${
              borderless
                ? 'bg-transparent border-none p-0 shadow-none focus:ring-0 text-sm'
                : `rounded-lg border bg-white dark:bg-zinc-900/50 text-left px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 ${
                    error ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-zinc-300 dark:border-zinc-800'
                  }`
            }`}
          >
            <span className={value ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'}>
              {getSelectedLabel()}
            </span>
            <ChevronDown className="w-4 h-4 text-zinc-400 dark:text-zinc-500 ml-1.5 shrink-0" />
          </button>
        }
        position="bottom center"
        on="click"
        closeOnDocumentClick
        arrow={false}
        contentStyle={{
          padding: '0px',
          border: 'none',
          background: 'transparent',
          boxShadow: 'none',
          width: triggerWidth !== 'auto' ? `${Math.max(parseFloat(triggerWidth), 180)}px` : '180px',
          zIndex: 9999,
        }}
      >
        {(close) => (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden py-1 max-h-60 overflow-y-auto animate-fade-in z-50 w-full">
            {placeholder && (
              <button
                type="button"
                onClick={() => handleSelect('', close)}
                className="w-full text-left px-4 py-2.5 text-xs font-semibold text-zinc-400 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {placeholder}
              </button>
            )}
            {options.map((opt) => {
              const optVal = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              const isSelected = String(optVal) === String(value);

              return (
                <button
                  key={optVal}
                  type="button"
                  onClick={() => handleSelect(optVal, close)}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {optLabel}
                </button>
              );
            })}
          </div>
        )}
      </Popup>
    </div>
  );
};

export default Select;
