'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';

type TutorStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';

interface TutorApplicationCardProps {
  tutorStatus: TutorStatus;
}

export default function TutorApplicationCard({ tutorStatus: initialStatus }: TutorApplicationCardProps) {
  const [status, setStatus] = useState<TutorStatus>(initialStatus || 'NONE');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleApply = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tutor-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit application');
      }

      setStatus('PENDING');
      toast({
        title: 'Application Submitted',
        description: 'Your application has been successfully submitted for review.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <Card className="p-8 flex flex-col items-center text-center bg-zinc-900 border-zinc-800 shadow-xl rounded-2xl">
        <div className="h-16 w-16 rounded-full bg-maroon-900/30 flex items-center justify-center mb-6">
          <GraduationCap className="h-8 w-8 text-maroon-500" />
        </div>
        
        <h2 className="text-2xl font-playfair font-bold text-zinc-100 mb-3">
          Become a Tutor
        </h2>
        
        <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
          Share your knowledge with fellow law students. As a tutor, you can upload lecture videos, study materials, and contribute to the learning community.
        </p>

        {status === 'NONE' && (
          <div className="w-full space-y-4">
            <Textarea
              placeholder="Why do you want to become a tutor? (Optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-zinc-950 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus:border-maroon-500 min-h-[100px]"
            />
            <Button 
              onClick={handleApply} 
              disabled={isLoading}
              className="w-full bg-maroon-700 hover:bg-maroon-600 text-white font-medium"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Apply Now'
              )}
            </Button>
          </div>
        )}

        {status === 'PENDING' && (
          <div className="w-full">
            <Badge variant="outline" className="mb-4 bg-amber-900/20 text-amber-400 border-amber-900/50 px-3 py-1 text-sm">
              Application Pending
            </Badge>
            <p className="text-sm text-zinc-400">
              Your application is being reviewed by an administrator. We will notify you once a decision is made.
            </p>
          </div>
        )}

        {status === 'REJECTED' && (
          <div className="w-full space-y-4">
            <Badge variant="outline" className="mb-2 bg-red-900/20 text-red-400 border-red-900/50 px-3 py-1 text-sm">
              Application Rejected
            </Badge>
            <p className="text-sm text-zinc-400 mb-4">
              Unfortunately, your application was not approved at this time.
            </p>
            <Button 
              onClick={() => setStatus('NONE')}
              variant="outline"
              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Re-apply
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
