'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getYouTubeThumbnail, formatRelativeDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { Play } from 'lucide-react';

interface ContentCardProps {
  content: {
    id: string;
    sessionName: string;
    videoUrl: string | null;
    level: number;
    subject: { name: string };
    createdAt: string | Date;
    createdBy: { fullName: string | null };
  };
  index?: number;
}

export function ContentCard({ content, index = 0 }: ContentCardProps) {
  const [imageError, setImageError] = useState(false);
  const thumbnailUrl = content.videoUrl ? getYouTubeThumbnail(content.videoUrl) : null;
  const staggerDelay = Math.min(index * 0.05, 0.6); // Cap stagger delay

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: staggerDelay, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative flex flex-col bg-surface border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
    >
      <Link href={`/content/${content.id}`} className="flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-xl">
        {/* Thumbnail Area */}
        <div className="relative aspect-video w-full bg-background/50 overflow-hidden">
          {thumbnailUrl && !imageError ? (
            <Image
              src={thumbnailUrl}
              alt={content.sessionName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-surface to-background flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center">
                <Play className="w-5 h-5 text-text-secondary ml-1" />
              </div>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          
          {/* Play button overlay on hover */}
          {thumbnailUrl && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm shadow-lg shadow-black/30">
                <Play className="w-5 h-5 text-white ml-1 fill-white" />
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="primary" className="text-[10px] px-1.5 py-0.5">Level {content.level}</Badge>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 border-accent/30 text-accent bg-accent/5">{content.subject.name}</Badge>
          </div>

          <h3 className="font-medium text-white line-clamp-2 leading-tight mb-3 group-hover:text-primary-light transition-colors">
            {content.sessionName}
          </h3>

          <div className="mt-auto flex items-center justify-between text-xs text-text-secondary">
            <span className="truncate pr-2">By {content.createdBy.fullName || 'Unknown'}</span>
            <span className="whitespace-nowrap flex-shrink-0">{formatRelativeDate(content.createdAt)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
