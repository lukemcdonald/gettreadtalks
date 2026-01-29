import { zid } from 'convex-helpers/server/zod4';
import { z } from 'zod';

export const clipFormSchema = z.object({
  description: z.string().optional(),
  mediaUrl: z.string().trim().url('Please enter a valid URL'),
  speakerId: zid('speakers').optional(),
  status: z.enum(['approved', 'archived', 'backlog', 'published']).default('backlog'),
  talkId: zid('talks').optional(),
  title: z.string().trim().min(1, 'Title is required'),
});

export type ClipFormData = z.infer<typeof clipFormSchema>;
