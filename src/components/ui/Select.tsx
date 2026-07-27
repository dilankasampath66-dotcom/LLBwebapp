'use client';

import React, { forwardRef } from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && (
          <label className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full appearance-none rounded-md border bg-card px-3 py-2 pr-10 text-sm text-text 
              transition-colors duration-120 
              focus:outline-none focus:ring-2 focus:ring-primary-light/50 
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? 'border-error focus:border-error focus:ring-error/20' : 'border-border hover:border-text-secondary/50 focus:border-primary'}
            `}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
