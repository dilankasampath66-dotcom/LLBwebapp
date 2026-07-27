'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Chip({ label, isActive = false, onClick, className = '' }: ChipProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors duration-120 border
        ${
          isActive
            ? 'bg-primary text-white border-primary'
            : 'bg-surface text-text-secondary border-border hover:text-text hover:border-text-secondary'
        }
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
        ${className}
      `}
    >
      {label}
    </motion.button>
  );
}
