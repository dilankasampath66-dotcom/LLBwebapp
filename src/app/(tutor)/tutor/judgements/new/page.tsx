'use client';

import { useRouter } from 'next/navigation';
import JudgementForm from '@/components/forms/JudgementForm';

export default function NewJudgementPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-playfair font-bold text-zinc-100">
          Add Landmark Judgement
        </h2>
        <p className="text-zinc-400 mt-1">
          Contribute a new case summary to the judgement database.
        </p>
      </div>
      
      <JudgementForm 
        mode="create" 
        onSuccess={() => {
          router.push('/tutor/my-submissions');
          router.refresh();
        }} 
      />
    </div>
  );
}
