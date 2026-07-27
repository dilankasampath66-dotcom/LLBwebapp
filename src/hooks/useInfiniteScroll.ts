'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  threshold?: number;
}

export function useInfiniteScroll({ onLoadMore, hasMore, threshold = 1.0 }: UseInfiniteScrollOptions) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const setTargetRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setIsIntersecting(true);
            onLoadMore();
          } else {
            setIsIntersecting(false);
          }
        },
        { threshold }
      );
      observerRef.current.observe(node);
    }

    targetRef.current = node;
  }, [hasMore, onLoadMore, threshold]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { targetRef: setTargetRef, isIntersecting };
}
