'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ChipProps {
  label: string;
  isActive?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ label, isActive, selected, onClick, className = '' }: ChipProps) {
  const active = isActive ?? selected ?? false;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors duration-120 border
        ${
          active
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

export default Chip;
