'use client';

import { Control, useFieldArray, FieldErrors } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DocumentUrlListProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  name?: string;
}

export default function DocumentUrlList({ control, errors, name = 'documentUrls' }: DocumentUrlListProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-zinc-300">
          Study Materials / Documents
        </label>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {fields.map((field, index) => {
            const fieldError = (errors as any)[name]?.[index];
            
            return (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95, overflow: 'hidden' }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-3"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Input
                      placeholder="Label (e.g. Lecture Slides)"
                      {...control.register(`${name}.${index}.label` as const)}
                      className="bg-zinc-900 border-zinc-800 text-zinc-200"
                    />
                    {fieldError?.label && (
                      <p className="mt-1 text-xs text-red-500">{fieldError.label.message}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="Google Drive URL"
                      {...control.register(`${name}.${index}.url` as const)}
                      className="bg-zinc-900 border-zinc-800 text-zinc-200"
                    />
                    {fieldError?.url && (
                      <p className="mt-1 text-xs text-red-500">{fieldError.url.message}</p>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="mt-0.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ label: '', url: '' })}
        className="w-full border-dashed border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 bg-transparent hover:bg-zinc-900"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Document
      </Button>
    </div>
  );
}
