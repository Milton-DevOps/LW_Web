import React from 'react';
import { colors } from '@/constants/colors';

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
          <label className="block text-sm font-semibold text-gray-800 mb-2">
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
            bg-white
            text-gray-900
            placeholder-gray-500
            focus:outline-none
            focus:border-[#cb4154]
            focus:ring-2
            focus:ring-[#cb4154]
            focus:ring-opacity-10
            transition-all
            duration-200
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm font-medium text-red-600 mt-1.5">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';Input.displayName = 'Input';
