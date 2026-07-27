'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/useToast';
import { createJudgementSchema } from '@/lib/validations/judgement';
import DocumentUrlList from './DocumentUrlList';
import RichTextEditor from './RichTextEditor';
import { cn, extractYouTubeId, getYouTubeThumbnail } from '@/lib/utils';
import { youtubeUrlRegex } from '@/lib/validations/common';

type JudgementFormValues = z.infer<typeof createJudgementSchema>;

interface JudgementFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  onSuccess?: () => void;
}

export default function JudgementForm({ mode, initialData, onSuccess }: JudgementFormProps) {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingAs, setSavingAs] = useState<'DRAFT' | 'PENDING_REVIEW' | null>(null);

  const defaultValues: Partial<JudgementFormValues> = {
    caseName: initialData?.caseName || '',
    caseNumber: initialData?.caseNumber || '',
    summary: initialData?.summary || '',
    level: initialData?.level || undefined,
    subjectId: initialData?.subjectId || '',
    videoUrl: initialData?.videoUrl || '',
    documentUrls: initialData?.documentUrls || [],
    status: initialData?.status || 'DRAFT',
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JudgementFormValues>({
    resolver: zodResolver(createJudgementSchema),
    defaultValues,
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
        .then((data) => setSubjects(data))
        .catch(() => setSubjects([]));
    }
  }, [level]);

  const onSubmit = async (data: JudgementFormValues, status: 'DRAFT' | 'PENDING_REVIEW') => {
    setIsSubmitting(true);
    setSavingAs(status);
    
    try {
      const payload = { ...data, status };
      const url = mode === 'create' ? '/api/judgements' : `/api/judgements/${initialData.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save judgement');
      }

      toast({
        title: 'Success',
        description: `Judgement ${status === 'DRAFT' ? 'saved as draft' : 'submitted for review'}.`,
        variant: 'success',
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save judgement. Please try again.',
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
      setSavingAs(null);
    }
  };

  return (
    <form className="space-y-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
      <div className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Case Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Case Name <span className="text-red-500">*</span></label>
            <Input 
              {...register('caseName')} 
              placeholder="e.g. Donoghue v Stevenson" 
              className="bg-zinc-950 border-zinc-800 text-zinc-200"
            />
            {errors.caseName && <p className="mt-1 text-xs text-red-500">{errors.caseName.message}</p>}
          </div>

          {/* Case Number */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Case Number <span className="text-red-500">*</span></label>
            <Input 
              {...register('caseNumber')} 
              placeholder="e.g. [1932] AC 562" 
              className="bg-zinc-950 border-zinc-800 text-zinc-200"
            />
            {errors.caseNumber && <p className="mt-1 text-xs text-red-500">{errors.caseNumber.message}</p>}
          </div>
        </div>

        {/* Level & Subject (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Related Level (Optional)</label>
            <div className="flex gap-2">
              {[3, 4, 5, 6].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    if (level === l) {
                      setValue('level', undefined);
                      setValue('subjectId', undefined);
                    } else {
                      setValue('level', l as any);
                    }
                  }}
                  className={cn(
                    'px-4 py-2 rounded-md font-medium text-sm transition-colors',
                    level === l 
                      ? 'bg-zinc-700 text-white border border-zinc-600' 
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 border border-transparent'
                  )}
                >
                  L{l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Related Subject (Optional)</label>
            <Controller
              control={control}
              name="subjectId"
              render={({ field }) => (
                <Select
                  disabled={!level || subjects.length === 0}
                  value={field.value || ''}
                  onValueChange={(val) => field.onChange(val || undefined)}
                >
                  <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-200">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-zinc-200 hover:bg-zinc-800 focus:bg-zinc-800">
                        {s.code} - {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Summary (Rich Text) */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Case Summary <span className="text-red-500">*</span></label>
          <Controller
            control={control}
            name="summary"
            render={({ field }) => (
              <RichTextEditor
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Enter a detailed case summary..."
              />
            )}
          />
          {errors.summary && <p className="mt-1 text-xs text-red-500">{errors.summary.message}</p>}
        </div>

        {/* Video Explainer URL */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Video Explainer URL (Optional)</label>
          <div className="relative">
            <Input 
              {...register('videoUrl')} 
              placeholder="https://www.youtube.com/watch?v=..." 
              className="bg-zinc-950 border-zinc-800 text-zinc-200 pr-10"
            />
            {videoUrl && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isValidYouTubeUrl ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
          </div>
          {errors.videoUrl && <p className="mt-1 text-xs text-red-500">{errors.videoUrl.message}</p>}
          
          {isValidYouTubeUrl && thumbnailUrl && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 relative w-48 aspect-video rounded-md overflow-hidden border border-zinc-700 shadow-md"
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

      </div>

      <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-800">
        <Button
          type="button"
          variant="outline"
          onClick={handleSubmit((data) => onSubmit(data, 'DRAFT'))}
          disabled={isSubmitting}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white min-w-[140px]"
        >
          {isSubmitting && savingAs === 'DRAFT' ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
          ) : null}
          Save as Draft
        </Button>
        <Button
          type="button"
          onClick={handleSubmit((data) => onSubmit(data, 'PENDING_REVIEW'))}
          disabled={isSubmitting}
          className="bg-maroon-700 hover:bg-maroon-600 text-white min-w-[160px]"
        >
          {isSubmitting && savingAs === 'PENDING_REVIEW' ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
          ) : null}
          Submit for Review
        </Button>
      </div>
    </form>
  );
}
