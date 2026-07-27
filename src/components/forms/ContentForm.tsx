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
import Textarea from '@/components/ui/Textarea';
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
  const [subjects, setSubjects] = useState<any[]>([]);
  const [existingSessions, setExistingSessions] = useState<string[]>([]);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isVideoValid, setIsVideoValid] = useState<boolean | null>(null);
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(createContentSchema),
    defaultValues: initialData || {
      level: 3,
      subjectId: '',
      sessionName: '',
      description: '',
      videoUrl: '',
      documentUrls: [],
      documentLabels: [],
    },
  });

  const level = watch('level');
  const videoUrl = watch('videoUrl');

  useEffect(() => {
    if (level) {
      fetch(`/api/subjects?level=${level}`)
        .then((res) => res.json())
        .then((data) => {
          setSubjects(data.subjects || []);
        })
        .catch(() => setSubjects([]));
    }
  }, [level]);

  useEffect(() => {
    if (videoUrl && youtubeUrlRegex.test(videoUrl)) {
      setIsVideoValid(true);
      const thumbnail = getYouTubeThumbnail(videoUrl);
      setVideoPreviewUrl(thumbnail);
    } else if (videoUrl) {
      setIsVideoValid(false);
      setVideoPreviewUrl(null);
    } else {
      setIsVideoValid(null);
      setVideoPreviewUrl(null);
    }
  }, [videoUrl]);

  const onSubmitForm = async (data: ContentFormValues, status: 'DRAFT' | 'PENDING_REVIEW') => {
    try {
      const payload = { ...data, status };
      const url = mode === 'create' ? '/api/content' : `/api/content/${initialData.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        addToast(err.message || 'Failed to save content', 'error');
        return;
      }

      addToast(
        status === 'DRAFT' ? 'Saved as draft!' : 'Submitted for review!',
        'success'
      );
      if (onSuccess) onSuccess();
    } catch (error) {
      addToast('An unexpected error occurred', 'error');
    }
  };

  return (
    <form className="space-y-6 max-w-4xl mx-auto">
      {/* Level Selection */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Study Level</label>
        <div className="flex bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] rounded-lg p-1 max-w-md">
          {[3, 4, 5, 6].map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setValue('level', l, { shouldValidate: true })}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                level === l
                  ? 'bg-[hsl(345,65%,25%)] text-white shadow'
                  : 'text-[hsl(220,10%,60%)] hover:text-white hover:bg-[hsl(220,16%,16%)]'
              }`}
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
          <Select
            label="Subject"
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
