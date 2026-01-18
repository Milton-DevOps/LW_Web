import React from 'react';
import { colors } from '@/constants/colors';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className = '', ...props }, ref) => {
    const baseStyles = 'font-semibold transition-colors duration-200 flex items-center justify-center';

    const variantStyles = {
      // Colors from constants/colors.ts - light theme
      primary: 'bg-[#cb4154] hover:bg-[#b8364b] text-white',
      secondary: 'bg-[#7e8ba3] hover:bg-[#6d7a92] text-white',
      tertiary: 'bg-[#f5a623] hover:bg-[#e09510] text-white',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-7 py-3.5 text-lg',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
