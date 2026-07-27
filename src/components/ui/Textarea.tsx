'use client';

import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-[hsl(220,10%,92%)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full rounded-md border bg-[hsl(220,18%,12%)] px-3 py-2 text-sm text-[hsl(220,10%,92%)] 
            placeholder:text-[hsl(220,10%,60%)]
            transition-colors duration-150 
            focus:outline-none focus:ring-2 focus:ring-[hsl(345,55%,40%)]/50 
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-[hsl(0,72%,50%)] focus:ring-[hsl(0,72%,50%)]/20' : 'border-[hsl(220,15%,20%)] hover:border-[hsl(220,10%,60%)]/50 focus:border-[hsl(345,65%,25%)]'}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-[hsl(0,72%,50%)]">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
