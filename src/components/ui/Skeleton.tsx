import React from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect' | 'card';
  className?: string;
}

export default function Skeleton({ variant = 'text', className = '' }: SkeletonProps) {
  const baseClasses = 'animate-skeleton rounded-md';
  
  const variants = {
    text: 'h-4 w-full',
    circle: 'rounded-full h-10 w-10',
    rect: 'h-24 w-full',
    card: 'h-48 w-full rounded-xl',
  };

  return <div className={`${baseClasses} ${variants[variant]} ${className}`} />;
}
