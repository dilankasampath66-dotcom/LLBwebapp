'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterBar } from '@/components/layout/FilterBar';
import { ContentCard } from '@/components/content/ContentCard';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface ContentItem {
  id: string;
  sessionName: string;
  videoUrl: string | null;
  level: number;
  subject: { name: string };
  createdAt: string;
  createdBy: { fullName: string | null };
}

export default function ContentPage() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetchContent = async (cursor?: string) => {
    try {
      const params = new URLSearchParams(searchParams.toString());
      if (cursor) params.set('cursor', cursor);
      
      const res = await fetch(`/api/content?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch content');
      
      const data = await res.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return { items: [], nextCursor: null };
    }
  };

  // Initial load when filters change
  useEffect(() => {
    setLoading(true);
    setError(null);
    setItems([]);
    
    fetchContent().then(data => {
      setItems(data.items || []);
      setNextCursor(data.nextCursor);
      setLoading(false);
    });
  }, [searchParams]);

  // Infinite scroll
  const loadMore = async () => {
    if (!nextCursor || loading) return;
    const data = await fetchContent(nextCursor);
    setItems(prev => [...prev, ...(data.items || [])]);
    setNextCursor(data.nextCursor);
  };

  const observerTarget = useInfiniteScroll(loadMore, !!nextCursor && !loading);

  return (
    <>
      <title>Study Materials | OUSL Law Student Portal</title>
      <FilterBar mode="content" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {loading && items.length === 0 ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="w-full aspect-video rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </motion.div>
          ) : error ? (
            <motion.div key="error" className="text-center py-12 text-error">
              <p>{error}</p>
            </motion.div>
          ) : items.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EmptyState
                icon={<BookOpen className="w-12 h-12" />}
                title="No study materials found"
                description="Try adjusting your filters or search query to find what you're looking for."
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {items.map((item, idx) => (
                <ContentCard key={item.id} content={item} index={idx} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading more indicator */}
        {nextCursor && (
          <div ref={observerTarget} className="py-8 flex justify-center">
            {loading && items.length > 0 && (
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        )}
      </div>
    </>
  );
}
