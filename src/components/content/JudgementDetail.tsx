'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Calendar, User, Scale, Youtube } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { getYouTubeEmbedUrl, formatRelativeDate } from '@/lib/utils';

interface JudgementDetailProps {
  judgement: {
    id: string;
    caseName: string;
    caseNo: string;
    summary: string;
    level: number | null;
    subject: { name: string } | null;
    videoUrl: string | null;
    documentUrls: string[];
    documentLabels: string[];
    createdAt: string | Date;
    createdBy: { fullName: string | null };
  };
}

export function JudgementDetail({ judgement }: JudgementDetailProps) {
  const embedUrl = judgement.videoUrl ? getYouTubeEmbedUrl(judgement.videoUrl) : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto pb-12"
    >
      <div className="mb-6">
        <Link 
          href="/judgements" 
          className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Judgements
        </Link>
      </div>

      {/* Main Content Info */}
      <div className="bg-surface rounded-xl p-6 md:p-8 border border-border shadow-sm mb-8 relative overflow-hidden">
        {/* Decorative background icon */}
        <Scale className="absolute -right-8 -top-8 w-48 h-48 text-accent/5 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap gap-3 mb-6">
            {judgement.level && (
              <Badge variant="outline" className="border-border text-text-secondary">Level {judgement.level}</Badge>
            )}
            {judgement.subject && (
              <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5">
                {judgement.subject.name}
              </Badge>
            )}
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
            {judgement.caseName}
          </h1>
          
          <div className="inline-block px-3 py-1 bg-primary/20 text-primary-light rounded border border-primary/30 font-mono text-sm mb-8">
            {judgement.caseNo}
          </div>

          <div className="prose prose-invert max-w-none text-text-secondary mb-8 whitespace-pre-wrap leading-relaxed text-lg">
            {judgement.summary}
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/50 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Added by {judgement.createdBy.fullName || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatRelativeDate(judgement.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Video Section */}
      {embedUrl && (
        <div className="mb-8">
          <h2 className="flex items-center gap-2 font-serif text-2xl font-bold text-white mb-6">
            <Youtube className="w-6 h-6 text-accent" />
            Video Explainer
          </h2>
          <div className="rounded-xl overflow-hidden bg-black aspect-video border border-border shadow-xl">
            <iframe
              src={embedUrl}
              title={`Explainer for ${judgement.caseName}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* Documents Section */}
      {judgement.documentUrls.length > 0 && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 font-serif text-2xl font-bold text-white mb-6">
            <FileText className="w-6 h-6 text-accent" />
            Case Materials & Documents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {judgement.documentUrls.map((url, idx) => {
              const label = judgement.documentLabels[idx] || `Document ${idx + 1}`;
              return (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 p-4 rounded-xl bg-surface border border-border hover:border-accent/50 hover:bg-surface-hover transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate group-hover:text-accent transition-colors">
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
