import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  status?: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
}

export default function Badge({ variant = 'default', status, className = '', children, ...props }: BadgeProps) {
  let mappedVariant = variant;

  if (status) {
    switch (status) {
      case 'DRAFT': mappedVariant = 'default'; break;
      case 'PENDING_REVIEW': mappedVariant = 'warning'; break;
      case 'APPROVED': mappedVariant = 'success'; break;
      case 'REJECTED': mappedVariant = 'error'; break;
    }
  }

  const variants = {
    default: 'bg-surface text-text-secondary border-border',
    success: 'bg-success/20 text-success border-success/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    error: 'bg-error/20 text-error border-error/30',
    info: 'bg-primary-light/20 text-primary-light border-primary-light/30',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[mappedVariant]} ${className}`}
      {...props}
    >
      {status ? status.replace('_', ' ') : children}
    </span>
  );
}
