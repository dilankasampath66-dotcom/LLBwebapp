import { z } from 'zod';
import { emailSchema, phoneSchema, passwordSchema, studyYearSchema } from './common';

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema,
  studyYear: studyYearSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone number is required'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, 'Email or phone number is required'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});
