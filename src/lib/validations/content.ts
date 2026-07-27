import { z } from 'zod';
import { levelSchema, youtubeUrlSchema, googleDriveUrlSchema } from './common';

export const createContentSchema = z.object({
  level: levelSchema,
  subjectId: z.string().min(1, 'Subject ID is required'),
  sessionName: z.string().min(1, 'Session name is required'),
  description: z.string().optional(),
  videoUrl: youtubeUrlSchema.optional(),
  documentUrls: z.array(googleDriveUrlSchema).optional().default([]),
  documentLabels: z.array(z.string()).optional().default([]),
}).refine((data) => !data.documentUrls || !data.documentLabels || data.documentUrls.length === data.documentLabels.length, {
  message: "Document URLs and Labels must have the same length",
  path: ["documentLabels"],
});

export const updateContentSchema = createContentSchema.partial();

export const contentFilterSchema = z.object({
  level: levelSchema.optional(),
  subjectId: z.string().optional(),
  session: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});
