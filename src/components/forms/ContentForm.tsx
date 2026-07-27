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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/useToast';
import { createContentSchema } from '@/lib/validations/content';
import DocumentUrlList from './DocumentUrlList';
import { cn, extractYouTubeId, getYouTubeThumbnail } from '@/lib/utils';
import { youtubeUrlRegex } from '@/lib/validations/common';

type ContentFormValues = z.infer<typeof createContentSchema>;

interface ContentFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  onSuccess?: () => void;
}

export default function ContentForm({ mode, initialData, onSuccess }: ContentFormProps) {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingAs, setSavingAs] = useState<'DRAFT' | 'PENDING_REVIEW' | null>(null);

  const defaultValues: Partial<ContentFormValues> = {
    level: initialData?.level || 3,
    subjectId: initialData?.subjectId || '',
    sessionName: initialData?.sessionName || '',
    videoUrl: initialData?.videoUrl || '',
    description: initialData?.description || '',
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
  } = useForm<ContentFormValues>({
    resolver: zodResolver(createContentSchema),
    defaultValues,
  });

  const level = watch('level');
  const subjectId = watch('subjectId');
  const videoUrl = watch('videoUrl');

  const isValidYouTubeUrl = videoUrl ? youtubeUrlRegex.test(videoUrl) : false;
  const youtubeId = isValidYouTubeUrl ? extractYouTubeId(videoUrl) : null;
  const thumbnailUrl = youtubeId ? getYouTubeThumbnail(youtubeId) : null;

  useEffect(() => {
    if (level) {
      // Fetch subjects for level
      fetch(`/api/subjects?level=${level}`)
        .then((res) => res.json())
        .then((data) => setSubjects(data))
        .catch(() => setSubjects([]));
    }
  }, [level]);

  useEffect(() => {
    if (level && subjectId) {
      // Fetch existing sessions for this subject/level to help autocomplete
      // This is a placeholder since we don't have a specific endpoint yet
      // In reality we'd fetch distinct session names
      setSessions([]);
    }
  }, [level, subjectId]);

  const onSubmit = async (data: ContentFormValues, status: 'DRAFT' | 'PENDING_REVIEW') => {
    setIsSubmitting(true);
    setSavingAs(status);
    
    try {
      const payload = { ...data, status };
      const url = mode === 'create' ? '/api/content' : `/api/content/${initialData.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save content');
      }

      toast({
        title: 'Success',
        description: `Content ${status === 'DRAFT' ? 'saved as draft' : 'submitted for review'}.`,
        variant: 'success',
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save content. Please try again.',
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
        
        {/* Level Selection */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Level</label>
          <div className="flex gap-2">
            {[3, 4, 5, 6].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setValue('level', l, { shouldValidate: true })}
                className={cn(
                  'px-6 py-2 rounded-md font-medium text-sm transition-colors',
                  level === l 
                    ? 'bg-maroon-700 text-white shadow-md' 
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                )}
              >
                Level {l}
              </button>
            ))}
          </div>
          {errors.level && <p className="mt-1 text-xs text-red-500">{errors.level.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Subject</label>
            <Controller
              control={control}
              name="subjectId"
              render={({ field }) => (
                <Select
                  disabled={!level || subjects.length === 0}
                  value={field.value}
                  onValueChange={field.onChange}
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
            {errors.subjectId && <p className="mt-1 text-xs text-red-500">{errors.subjectId.message}</p>}
          </div>

          {/* Session Name (Combobox simulation) */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Session Name</label>
            <Input 
              {...register('sessionName')} 
              placeholder="e.g. Session 1: Introduction" 
              className="bg-zinc-950 border-zinc-800 text-zinc-200"
              list="session-options"
            />
            <datalist id="session-options">
              {sessions.map(s => <option key={s} value={s} />)}
            </datalist>
            {errors.sessionName && <p className="mt-1 text-xs text-red-500">{errors.sessionName.message}</p>}
          </div>
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">YouTube Video URL</label>
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
          
          {/* Live Thumbnail Preview */}
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

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Description (Optional)</label>
          <Textarea 
            {...register('description')} 
            placeholder="Add any extra notes or context..."
            className="bg-zinc-950 border-zinc-800 text-zinc-200 min-h-[120px]"
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
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
