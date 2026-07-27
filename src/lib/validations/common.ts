import { z } from 'zod';

export const sriLankanPhoneRegex = /^(?:\+94|0)[0-9]{9}$/;
export const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/;
export const googleDriveUrlRegex = /^https?:\/\/drive\.google\.com\//;

export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().regex(sriLankanPhoneRegex, 'Must be a valid Sri Lankan phone number');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters long').regex(/(?=.*[a-zA-Z])(?=.*[0-9])/, 'Must contain at least one letter and one number');
export const studyYearSchema = z.coerce.number().int().min(3).max(6);
export const youtubeUrlSchema = z.string().url().regex(youtubeUrlRegex, 'Must be a valid YouTube URL');
export const googleDriveUrlSchema = z.string().url().regex(googleDriveUrlRegex, 'Must be a valid Google Drive URL');
export const levelSchema = z.coerce.number().int().min(3).max(6);
