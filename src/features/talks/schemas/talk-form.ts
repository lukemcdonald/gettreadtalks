import type { StatusType } from '@/convex/lib/validators/shared';
import type { SpeakerId } from '@/features/speakers/types';

import { zid } from 'convex-helpers/server/zod4';
import { z } from 'zod';

/**
 * Zod schema for talk form validation.
 * Works with React Hook Form which passes typed values directly (not FormData).
 */
export const talkFormSchema = z.object({
  collectionId: zid('collections').optional(),
  collectionOrder: z.number().optional(),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  mediaUrl: z.string().trim().url('Please enter a valid URL'),
  scripture: z.string().optional(),
  speakerId: z
    .string()
    .min(1, 'Speaker is required')
    .transform((val) => val as SpeakerId),
  status: z
    .enum(['approved', 'archived', 'backlog', 'published'])
    .default('backlog')
    .transform((val) => val as StatusType),
  title: z.string().trim().min(2, 'Title must be at least 2 characters'),
});

/**
 * Type inferred from the talk form schema.
 */
export type TalkFormData = z.infer<typeof talkFormSchema>;
