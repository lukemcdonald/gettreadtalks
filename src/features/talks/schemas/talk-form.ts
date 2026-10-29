import { zid } from 'convex-helpers/server/zod4';
import { z } from 'zod';

import { isFutureUtcDate, parseUtcDate } from '@/convex/lib/publishedAt';

const publishDateSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || parseUtcDate(value) !== undefined, {
    error: 'Enter a valid date',
  })
  .refine((value) => !value || !isFutureUtcDate(value), {
    error: 'Publish date cannot be in the future',
  });

/**
 * Zod schema for talk form validation.
 * Works with React Hook Form which passes typed values directly (not FormData).
 */
export const talkFormSchema = z.object({
  collectionId: zid('collections').optional(),
  collectionOrder: z.number().optional(),
  featured: z.boolean().default(false),
  mediaUrl: z.url('Please enter a valid URL'),
  publishedAt: publishDateSchema,
  scripture: z.string().optional(),
  slug: z.string().trim().optional(),
  speakerId: z
    .string({ error: 'Speaker is required' })
    .min(1, 'Speaker is required')
    .pipe(zid('speakers')),
  status: z
    .enum(['approved', 'archived', 'backlog', 'published'])
    .default('backlog'),
  title: z.string().trim().min(2, 'Title must be at least 2 characters'),
  topicIds: z.array(zid('topics')).default([]),
});

/**
 * Type inferred from the talk form schema.
 */
export type TalkFormData = z.infer<typeof talkFormSchema>;
