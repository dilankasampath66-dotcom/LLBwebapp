'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@/lib/validations/auth';
import type { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      studyYear: 3,
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const password = watch('password');
  const studyYear = watch('studyYear');

  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Za-z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(password || '');

  const onSubmit = async (data: SignupFormValues) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        setError(result.message || 'Failed to create account.');
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
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
        <h2 className="font-serif text-2xl text-[#EBEBEB] mb-2">Account Created</h2>
        <p className="text-[#999999]">Check your email for verification. Redirecting to login...</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#EBEBEB]">
          Create Account
        </h2>
        <p className="text-[#999999] text-sm">
          Join OUSL Law Student Portal
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="student@ousl.lk"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+94XXXXXXXXX or 0XXXXXXXXX"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#EBEBEB]">Study Year</label>
          <div className="flex bg-[#14161B] border border-[#2B2F39] rounded-lg p-1">
            {[3, 4, 5, 6].map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setValue('studyYear', year, { shouldValidate: true })}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  studyYear === year 
                    ? 'bg-[#801734] text-white shadow' 
                    : 'text-[#999999] hover:text-[#EBEBEB] hover:bg-[#1C1F26]'
                }`}
              >
                Year {year}
              </button>
            ))}
          </div>
          {errors.studyYear && <p className="text-[#E53935] text-xs">{errors.studyYear.message}</p>}
        </div>

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            error={errors.password?.message}
            {...register('password')}
          />
          {/* Password Strength Indicator */}
          {password && (
            <div className="flex gap-1 h-1.5 mt-2">
              <div className={`flex-1 rounded-full transition-colors duration-300 ${strength >= 1 ? 'bg-[#E53935]' : 'bg-[#2B2F39]'}`} />
              <div className={`flex-1 rounded-full transition-colors duration-300 ${strength >= 2 ? 'bg-[#F59E0B]' : 'bg-[#2B2F39]'}`} />
              <div className={`flex-1 rounded-full transition-colors duration-300 ${strength >= 3 ? 'bg-[#2E7D32]' : 'bg-[#2B2F39]'}`} />
            </div>
          )}
          {password && (
            <p className="text-xs text-[#999999] mt-1 text-right">
              {strength === 0 && 'Very Weak'}
              {strength === 1 && 'Weak'}
              {strength === 2 && 'Fair'}
              {strength === 3 && 'Strong'}
            </p>
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
              className="text-[#E53935] text-sm font-medium text-center bg-[#E53935]/10 rounded-md py-2 px-3 overflow-hidden"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full mt-4" 
          isLoading={isSubmitting}
        >
          Create Account
        </Button>
      </form>

      <div className="text-center">
        <p className="text-[#999999] text-sm">
          Already have an account?{' '}
          <Link 
            href="/login" 
            className="text-[#EBEBEB] hover:text-[#D4AF37] font-medium transition-colors focus:outline-none focus:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
