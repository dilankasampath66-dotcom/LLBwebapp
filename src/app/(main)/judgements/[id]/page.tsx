'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { JudgementDetail } from '@/components/content/JudgementDetail';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { Scale } from 'lucide-react';

export default function JudgementDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [judgement, setJudgement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/judgements/${id}`);
        if (res.status === 404) {
          setError('Judgement not found');
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch judgement');
        
        const data = await res.json();
        setJudgement(data);
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
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-8" />
        <Skeleton className="h-32 w-full mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !judgement) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <EmptyState
          icon={<Scale className="w-12 h-12" />}
          title="Judgement Not Found"
          description={error || "The landmark judgement you're looking for doesn't exist or has been removed."}
          action={{
            label: "Back to Judgements",
            onClick: () => router.push('/judgements')
          }}
        />
      </div>
    );
  }

  return (
    <>
      <title>{`${judgement.caseName} | OUSL Law Student Portal`}</title>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <JudgementDetail judgement={judgement} />
      </div>
    </>
  );
}
