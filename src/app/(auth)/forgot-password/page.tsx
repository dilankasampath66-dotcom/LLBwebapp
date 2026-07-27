'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/lib/validations/auth';
import type { z } from 'zod';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifier: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // We always show success to prevent email enumeration
      setIsSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center py-6 text-center space-y-6"
      >
        <div className="w-16 h-16 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center mb-2">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-[#EBEBEB]">Check your messages</h2>
        <p className="text-[#999999] max-w-sm">
          If an account exists with that email or phone number, we&apos;ve sent a reset link to it.
        </p>
        
        <Link 
          href="/login" 
          className="text-[#D4AF37] hover:text-[#f3cd4a] font-medium transition-colors focus:outline-none focus:underline pt-4"
        >
          Back to sign in
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#EBEBEB]">
          Reset Password
        </h2>
        <p className="text-[#999999] text-sm">
          Enter your email or phone number to receive a reset code
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email or Phone Number"
          type="text"
          placeholder="Email address or phone number"
          error={errors.identifier?.message}
          {...register('identifier')}
        />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-[#E53935] text-sm font-medium text-center bg-[#E53935]/10 rounded-md py-2 px-3 overflow-hidden"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full mt-2" 
          isLoading={isSubmitting}
        >
          Send Reset Link
        </Button>
      </form>

      <div className="text-center pt-2">
        <Link 
          href="/login" 
          className="text-[#999999] hover:text-[#EBEBEB] text-sm transition-colors focus:outline-none focus:underline"
        >
          &larr; Back to sign in
        </Link>
      </div>
    </div>
  );
}
