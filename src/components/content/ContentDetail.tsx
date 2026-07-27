'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Calendar, User } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { getYouTubeEmbedUrl, formatRelativeDate } from '@/lib/utils';

interface ContentDetailProps {
  content: {
    id: string;
    sessionName: string;
    description: string | null;
    videoUrl: string | null;
    level: number;
    subject: { name: string };
    documentUrls: string[];
    documentLabels: string[];
    createdAt: string | Date;
    createdBy: { fullName: string | null };
  };
}

export function ContentDetail({ content }: ContentDetailProps) {
  const embedUrl = content.videoUrl ? getYouTubeEmbedUrl(content.videoUrl) : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto pb-12"
    >
      <div className="mb-6">
        <Link 
          href="/content" 
          className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Content
        </Link>
      </div>

      {/* Video Player */}
      <div className="rounded-xl overflow-hidden bg-black aspect-video mb-8 border border-border shadow-2xl">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={content.sessionName}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full h-full border-0"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-surface/50 text-text-secondary">
            <div className="w-16 h-16 rounded-full bg-surface-hover flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 opacity-50" />
            </div>
            <p>No video available for this session</p>
          </div>
        )}
      </div>

      {/* Content Info */}
      <div className="bg-surface rounded-xl p-6 md:p-8 border border-border shadow-sm mb-8">
        <div className="flex flex-wrap gap-3 mb-4">
          <Badge variant="primary">Level {content.level}</Badge>
          <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5">
            {content.subject.name}
          </Badge>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
          {content.sessionName}
        </h1>

        {content.description && (
          <div className="prose prose-invert max-w-none text-text-secondary mb-8 whitespace-pre-wrap leading-relaxed">
            {content.description}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/50 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{content.createdBy.fullName || 'Unknown Tutor'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatRelativeDate(content.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      {content.documentUrls.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-white mb-6">Attached Documents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.documentUrls.map((url, idx) => {
              const label = content.documentLabels[idx] || `Document ${idx + 1}`;
              return (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 p-4 rounded-xl bg-surface border border-border hover:border-primary/50 hover:bg-surface-hover transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate group-hover:text-primary-light transition-colors">
                      {label}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">External Link</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
