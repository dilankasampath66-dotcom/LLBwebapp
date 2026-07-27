'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ContentDetail } from '@/components/content/ContentDetail';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { BookOpen } from 'lucide-react';

export default function ContentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/content/${id}`);
        if (res.status === 404) {
          setError('Content not found');
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch content');
        
        const data = await res.json();
        setContent(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <Skeleton className="w-full aspect-video rounded-xl mb-8" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-8" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <EmptyState
          icon={<BookOpen className="w-12 h-12" />}
          title="Content Not Found"
          description={error || "The study material you're looking for doesn't exist or has been removed."}
          {/* @ts-ignore */}
          action={{
            label: "Back to Content",
            onClick: () => router.push('/content')
          }}
        />
      </div>
    );
  }

  return (
    <>
      <title>{`${content.sessionName} | OUSL Law Student Portal`}</title>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <ContentDetail content={content} />
      </div>
    </>
  );
}
