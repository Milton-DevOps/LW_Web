import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <div className={widthStyle}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full
            px-4 py-2.5
            text-base
            border-2
            border-gray-300
            dark:border-gray-600
            bg-white
            dark:bg-gray-800
            text-gray-900
            dark:text-white
            placeholder-gray-500
            dark:placeholder-gray-400
            focus:outline-none
            focus:border-[#cb4154]
            dark:focus:border-[#ff6b7a]
            transition-colors
            duration-200
            ${error ? 'border-red-500 dark:border-red-400' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
