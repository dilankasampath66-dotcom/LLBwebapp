'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  threshold?: number;
}

export function useInfiniteScroll(
  onLoadMoreOrOptions: any,
  hasMoreParam?: boolean,
  thresholdParam: number = 1.0
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const onLoadMore = typeof onLoadMoreOrOptions === 'function' ? onLoadMoreOrOptions : onLoadMoreOrOptions?.onLoadMore;
  const hasMore = typeof onLoadMoreOrOptions === 'function' ? (hasMoreParam ?? true) : onLoadMoreOrOptions?.hasMore;
  const threshold = typeof onLoadMoreOrOptions === 'function' ? thresholdParam : (onLoadMoreOrOptions?.threshold ?? 1.0);

  const setTargetRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node && onLoadMore) {
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

  return { targetRef: setTargetRef, isIntersecting, observerTarget: setTargetRef } as any;
}

export default useInfiniteScroll;
