'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterBar } from '@/components/layout/FilterBar';
import { JudgementCard } from '@/components/content/JudgementCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale } from 'lucide-react';

export default function JudgementsPage() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetchJudgements = async (cursor?: string) => {
    try {
      const params = new URLSearchParams(searchParams.toString());
      if (cursor) params.set('cursor', cursor);
      
      const res = await fetch(`/api/judgements?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch judgements');
      
      const data = await res.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return { items: [], nextCursor: null };
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    setItems([]);
    
    fetchJudgements().then(data => {
      setItems(data.items || []);
      setNextCursor(data.nextCursor);
      setLoading(false);
    });
  }, [searchParams]);

  const loadMore = async () => {
    if (!nextCursor || loading) return;
    const data = await fetchJudgements(nextCursor);
    setItems(prev => [...prev, ...(data.items || [])]);
    setNextCursor(data.nextCursor);
  };

  const observerTarget = useInfiniteScroll(loadMore, !!nextCursor && !loading);

  return (
    <>
      <title>Landmark Judgements | OUSL Law Student Portal</title>
      <FilterBar mode="judgement" />
      
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
                <div key={i} className="bg-surface rounded-xl p-5 border border-border h-48 flex flex-col">
                  <div className="flex justify-between mb-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="w-16 h-5 rounded" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <Skeleton className="h-4 w-full" />
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
                icon={<Scale className="w-12 h-12" />}
                title="No judgements found"
                description="Try adjusting your filters to find what you're looking for."
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {items.map((item, idx) => (
                <JudgementCard key={item.id} judgement={item} index={idx} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {nextCursor && (
          <div ref={observerTarget} className="py-8 flex justify-center">
            {loading && items.length > 0 && (
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        )}
      </div>
    </>
  );
}
