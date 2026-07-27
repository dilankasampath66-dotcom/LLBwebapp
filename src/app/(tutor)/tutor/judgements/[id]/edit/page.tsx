'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import JudgementForm from '@/components/forms/JudgementForm';
import { Card } from '@/components/ui/Card';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function EditJudgementPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [judgement, setJudgement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/judgements/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch judgement');
        return res.json();
      })
      .then((data) => {
        setJudgement(data);
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: 'Failed to load judgement details',
          variant: 'error',
        });
        router.push('/tutor/my-submissions');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, router, toast]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-maroon-600 border-t-transparent" />
      </div>
    );
  }

  if (!judgement) return null;

  const isApproved = judgement.status === 'APPROVED';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-playfair font-bold text-zinc-100">
          Edit Landmark Judgement
        </h2>
      </div>

      {isApproved && (
        <Card className="p-4 mb-6 bg-amber-950/30 border-amber-900/50 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-500">Judgement Approved</h3>
            <p className="text-sm text-amber-400/80 mt-1">
              This judgement has already been approved and is live. Editing it will change its status to pending review.
            </p>
          </div>
        </Card>
      )}
      
      <JudgementForm 
        mode="edit" 
        initialData={judgement}
        onSuccess={() => {
          router.push('/tutor/my-submissions');
          router.refresh();
        }} 
      />
    </div>
  );
}
