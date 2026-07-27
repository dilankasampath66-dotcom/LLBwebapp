'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations/auth';
import type { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      const result = await signIn('credentials', {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email/phone or password. Please try again.');
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 800);
      }
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
        <h2 className="font-serif text-2xl text-[#EBEBEB] mb-2">Welcome Back</h2>
        <p className="text-[#999999]">Redirecting you to the portal...</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#EBEBEB]">
          Welcome Back
        </h2>
        <p className="text-[#999999] text-sm">
          Sign in to access your study materials
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

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-[#2B2F39] bg-[#14161B] text-[#801734] focus:ring-[#801734] focus:ring-offset-[#1C1F26]" 
            />
            <span className="text-sm text-[#999999] group-hover:text-[#EBEBEB] transition-colors">
              Remember me
            </span>
          </label>
          <Link 
            href="/forgot-password" 
            className="text-sm text-[#D4AF37] hover:text-[#f3cd4a] transition-colors focus:outline-none focus:underline"
          >
            Forgot password?
          </Link>
        </div>

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
          Sign In
        </Button>
      </form>

      <div className="text-center">
        <p className="text-[#999999] text-sm">
          Don&apos;t have an account?{' '}
          <Link 
            href="/signup" 
            className="text-[#EBEBEB] hover:text-[#D4AF37] font-medium transition-colors focus:outline-none focus:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
