'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatRelativeDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { Scale } from 'lucide-react';

interface JudgementCardProps {
  judgement: {
    id: string;
    caseName: string;
    caseNo: string;
    summary: string;
    level: number | null;
    subject: { name: string } | null;
    createdAt: string | Date;
  };
  index?: number;
}

export function JudgementCard({ judgement, index = 0 }: JudgementCardProps) {
  const staggerDelay = Math.min(index * 0.05, 0.6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: staggerDelay, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative flex flex-col bg-surface border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
    >
      <Link href={`/judgements/${judgement.id}`} className="flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:scale-110 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
          {(judgement.level || judgement.subject) && (
            <div className="flex gap-1.5 flex-wrap justify-end pl-2">
              {judgement.level && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 border-border text-text-secondary">
                  Level {judgement.level}
                </Badge>
              )}
              {judgement.subject && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 border-accent/30 text-accent bg-accent/5">
                  {judgement.subject.name}
                </Badge>
              )}
            </div>
          )}
        </div>

        <h3 className="font-serif text-lg font-bold text-white line-clamp-2 leading-tight mb-1 group-hover:text-accent transition-colors">
          {judgement.caseName}
        </h3>
        
        <p className="text-xs font-medium text-primary-light mb-3 font-mono">
          {judgement.caseNo}
        </p>

        <p className="text-sm text-text-secondary line-clamp-3 mb-4 flex-1">
          {judgement.summary}
        </p>

        <div className="mt-auto pt-4 border-t border-border/50 text-xs text-text-secondary text-right">
          Added {formatRelativeDate(judgement.createdAt)}
        </div>
      </Link>
    </motion.div>
  );
}
