'use client';

import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, startIcon, endIcon, className = '', type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && (
          <label className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {startIcon}
            </div>
          )}
          <motion.input
            ref={ref}
            type={inputType}
            animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`
              w-full rounded-md border bg-card px-3 py-2 text-sm text-text 
              transition-colors duration-120 
              placeholder:text-text-secondary/50 
              focus:outline-none focus:ring-2 focus:ring-primary-light/50 
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? 'border-error focus:border-error focus:ring-error/20' : 'border-border hover:border-text-secondary/50 focus:border-primary'}
              ${startIcon ? 'pl-10' : ''}
              ${endIcon || isPassword ? 'pr-10' : ''}
            `}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.71-1.583c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m-5.858-.908a3 3 0 00-4.243-4.243M12 15a3.001 3.001 0 001.122-5.783" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          ) : endIcon ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {endIcon}
            </div>
          ) : null}
        </div>
        {(error || helperText) && (
          <span className={`text-xs ${error ? 'text-error' : 'text-text-secondary'}`}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export default Input;
