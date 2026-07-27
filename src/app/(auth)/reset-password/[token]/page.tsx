'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '@/lib/validations/auth';
import type { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;
  
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Za-z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(password || '');

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    setError(null);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await res.json();
      
      if (!res.ok) {
        setError(result.message || 'The reset link has expired or is invalid.');
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-16 h-16 bg-[#2E7D32]/20 text-[#2E7D32] rounded-full flex items-center justify-center mb-6"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h2 className="font-serif text-2xl text-[#EBEBEB] mb-2">Password Reset Successfully</h2>
        <p className="text-[#999999]">Redirecting you to sign in...</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#EBEBEB]">
          Set New Password
        </h2>
        <p className="text-[#999999] text-sm">
          Enter your new password below
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Input
            label="New Password"
            type="password"
            placeholder="Create a strong password"
            error={errors.password?.message}
            {...register('password')}
          />
          {password && (
            <div className="flex gap-1 h-1.5 mt-2">
              <div className={`flex-1 rounded-full transition-colors duration-300 ${strength >= 1 ? 'bg-[#E53935]' : 'bg-[#2B2F39]'}`} />
              <div className={`flex-1 rounded-full transition-colors duration-300 ${strength >= 2 ? 'bg-[#F59E0B]' : 'bg-[#2B2F39]'}`} />
              <div className={`flex-1 rounded-full transition-colors duration-300 ${strength >= 3 ? 'bg-[#2E7D32]' : 'bg-[#2B2F39]'}`} />
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col items-center text-[#E53935] text-sm font-medium text-center bg-[#E53935]/10 rounded-md py-3 px-3 overflow-hidden"
            >
              <p>{error}</p>
              <Link href="/forgot-password" className="mt-2 text-[#E53935] underline underline-offset-2 hover:text-[#c62828]">
                Request a new reset link
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full mt-2" 
          isLoading={isSubmitting}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}
