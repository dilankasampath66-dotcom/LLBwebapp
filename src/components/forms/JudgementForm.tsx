'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useToast } from '@/hooks/useToast';
import { createJudgementSchema } from '@/lib/validations/judgement';
import DocumentUrlList from './DocumentUrlList';
import RichTextEditor from './RichTextEditor';
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/utils';
import { youtubeUrlRegex } from '@/lib/validations/common';

type JudgementFormValues = z.infer<typeof createJudgementSchema>;

interface JudgementFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  onSuccess?: () => void;
}

export default function JudgementForm({ mode, initialData, onSuccess }: JudgementFormProps) {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [savingAs, setSavingAs] = useState<'DRAFT' | 'PENDING_REVIEW' | null>(null);
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JudgementFormValues>({
    resolver: zodResolver(createJudgementSchema),
    defaultValues: initialData || {
      caseName: '',
      caseNo: '',
      summary: '',
      level: undefined,
      subjectId: '',
      videoUrl: '',
      documentUrls: [],
      documentLabels: [],
    },
  });

  const level = watch('level');
  const videoUrl = watch('videoUrl');

  const isValidYouTubeUrl = videoUrl ? youtubeUrlRegex.test(videoUrl) : false;
  const youtubeId = isValidYouTubeUrl ? extractYouTubeId(videoUrl) : null;
  const thumbnailUrl = youtubeId ? getYouTubeThumbnail(youtubeId) : null;

  useEffect(() => {
    if (level) {
      fetch(`/api/subjects?level=${level}`)
        .then((res) => res.json())
        .then((data) => setSubjects(data.subjects || []))
        .catch(() => setSubjects([]));
    }
  }, [level]);

  const onSubmitForm = async (data: JudgementFormValues, status: 'DRAFT' | 'PENDING_REVIEW') => {
    setSavingAs(status);
    try {
      const payload = { ...data, status };
      const url = mode === 'create' ? '/api/judgements' : `/api/judgements/${initialData.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        addToast(err.message || 'Failed to save judgement', 'error');
        return;
      }

      addToast(
        status === 'DRAFT' ? 'Saved as draft!' : 'Submitted for review!',
        'success'
      );
      if (onSuccess) onSuccess();
    } catch (error) {
      addToast('An unexpected error occurred', 'error');
    } finally {
      setSavingAs(null);
    }
  };

  return (
    <form className="space-y-6 max-w-4xl mx-auto bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] p-6 rounded-xl shadow-md">
      {/* Case Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Case Name"
          placeholder="e.g. Attorney General v. Samarakkody"
          error={errors.caseName?.message}
          {...register('caseName')}
        />
        <Input
          label="Case Number"
          placeholder="e.g. SC Application No. 12/2020"
          error={errors.caseNo?.message}
          {...register('caseNo')}
        />
      </div>

      {/* Summary Rich Text */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Case Summary</label>
        <Controller
          control={control}
          name="summary"
          render={({ field }) => (
            <RichTextEditor
              value={field.value || ''}
              onChange={field.onChange}
              placeholder="Enter comprehensive case summary..."
            />
          )}
        />
        {errors.summary && <p className="mt-1 text-xs text-red-500">{errors.summary.message}</p>}
      </div>

      {/* Level & Subject Optional Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Level (Optional)</label>
          <div className="flex bg-[hsl(220,16%,16%)] border border-[hsl(220,15%,20%)] rounded-lg p-1">
            {[3, 4, 5, 6].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setValue('level', level === l ? undefined : l, { shouldValidate: true })}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  level === l
                    ? 'bg-[hsl(345,65%,25%)] text-white shadow'
                    : 'text-[hsl(220,10%,60%)] hover:text-white hover:bg-[hsl(220,15%,20%)]'
                }`}
              >
                Level {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Select
            label="Related Subject (Optional)"
            disabled={!level || subjects.length === 0}
            options={[
              { label: 'Select a subject', value: '' },
              ...subjects.map((s) => ({
                label: s.name,
                value: s.id,
              })),
            ]}
            error={errors.subjectId?.message}
            {...register('subjectId')}
          />
        </div>
      </div>

      {/* Video Explainer URL */}
      <div>
        <div className="relative">
          <Input 
            label="Video Explainer URL (Optional)"
            placeholder="https://www.youtube.com/watch?v=..." 
            error={errors.videoUrl?.message}
            {...register('videoUrl')}
          />
          {videoUrl && (
            <div className="absolute right-3 top-9">
              {isValidYouTubeUrl ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        
        {isValidYouTubeUrl && thumbnailUrl && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 relative w-48 aspect-video rounded-md overflow-hidden border border-[hsl(220,15%,20%)] shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnailUrl} alt="Video thumbnail preview" className="w-full h-full object-cover" />
          </motion.div>
        )}
      </div>

      {/* Document URLs (Repeater) */}
      <div className="pt-2">
        <DocumentUrlList control={control} errors={errors} />
      </div>

      <div className="flex items-center justify-end gap-4 pt-6 border-t border-[hsl(220,15%,20%)]">
        <Button
          type="button"
          variant="secondary"
          onClick={handleSubmit((data) => onSubmitForm(data, 'DRAFT'))}
          isLoading={isSubmitting && savingAs === 'DRAFT'}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleSubmit((data) => onSubmitForm(data, 'PENDING_REVIEW'))}
          isLoading={isSubmitting && savingAs === 'PENDING_REVIEW'}
        >
          Submit for Review
        </Button>
      </div>
    </form>
  );
}
