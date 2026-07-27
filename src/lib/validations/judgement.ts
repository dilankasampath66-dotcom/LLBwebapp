import { z } from 'zod';
import { levelSchema, youtubeUrlSchema, googleDriveUrlSchema } from './common';

export const createJudgementSchema = z.object({
  caseName: z.string().min(1, 'Case name is required'),
  caseNo: z.string().min(1, 'Case number is required'),
  summary: z.string().min(1, 'Summary is required'),
  level: levelSchema.optional(),
  subjectId: z.string().optional(),
  videoUrl: youtubeUrlSchema.optional(),
  documentUrls: z.array(googleDriveUrlSchema).optional().default([]),
  documentLabels: z.array(z.string()).optional().default([]),
}).refine((data) => !data.documentUrls || !data.documentLabels || data.documentUrls.length === data.documentLabels.length, {
  message: "Document URLs and Labels must have the same length",
  path: ["documentLabels"],
});

export const updateJudgementSchema = createJudgementSchema.partial();

export const judgementFilterSchema = z.object({
  level: levelSchema.optional(),
  subjectId: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});
