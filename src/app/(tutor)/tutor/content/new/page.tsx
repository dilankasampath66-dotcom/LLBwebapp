'use client';

import { useRouter } from 'next/navigation';
import ContentForm from '@/components/forms/ContentForm';

export default function NewContentPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-playfair font-bold text-zinc-100">
          Add Study Content
        </h2>
        <p className="text-zinc-400 mt-1">
          Upload new study materials, video lectures, and resources.
        </p>
      </div>
      
      <ContentForm 
        mode="create" 
        onSuccess={() => {
          router.push('/tutor/my-submissions');
          router.refresh();
        }} 
      />
    </div>
  );
}
