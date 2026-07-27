import React from 'react';
import Link from 'next/link';
import Button from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode | React.ElementType;
  action?: React.ReactNode | { label: string; onClick?: () => void; href?: string };
  className?: string;
}

export function EmptyState({ title, description, icon, action, className = '' }: EmptyStateProps) {
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && 'render' in (icon as any))) {
      const IconComponent = icon as React.ElementType;
      return <IconComponent className="w-10 h-10 text-text-secondary" />;
    }
    return icon as React.ReactNode;
  };

  const renderAction = () => {
    if (!action) return null;
    if (typeof action === 'object' && action !== null && 'label' in action && !React.isValidElement(action)) {
      const actObj = action as { label: string; onClick?: () => void; href?: string };
      if (actObj.href) {
        return (
          <Link href={actObj.href} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-white hover:bg-primary-light h-10 px-4 py-2">
            {actObj.label}
          </Link>
        );
      }
      return (
        <Button onClick={actObj.onClick}>
          {actObj.label}
        </Button>
      );
    }
    return action as React.ReactNode;
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 bg-card border border-dashed border-border rounded-xl ${className}`}>
      {icon ? (
        <div className="text-text-secondary/50 mb-4">{renderIcon()}</div>
      ) : (
        <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-text-secondary mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
      )}
      <h3 className="text-lg font-semibold text-text mb-2 font-heading">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>
      {action && <div>{renderAction()}</div>}
    </div>
  );
}

export default EmptyState;
