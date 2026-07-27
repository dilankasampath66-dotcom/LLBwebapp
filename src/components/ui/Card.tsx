'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  isClickable?: boolean;
}

export default function Card({
  children,
  padding = 'md',
  isClickable = false,
  className = '',
  onClick,
  ...props
}: CardProps) {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  const baseClasses = `bg-card border border-border rounded-xl shadow-sm text-text ${paddings[padding]} ${className}`;

  if (isClickable || onClick) {
    return (
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        className={`${baseClasses} cursor-pointer hover:border-primary-light/50 transition-colors`}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-col space-y-1.5 pb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`font-heading text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex items-center pt-4 ${className}`}>{children}</div>;
}
