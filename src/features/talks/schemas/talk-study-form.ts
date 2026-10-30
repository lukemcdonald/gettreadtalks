import { z } from 'zod';

export const talkFeatureFormSchema = z.object({
  body: z.string(),
  status: z.enum(['draft', 'published']),
});

export const talkSummaryFormSchema = z.object({
  summary: z.string(),
});

export type TalkFeatureFormData = z.infer<typeof talkFeatureFormSchema>;
export type TalkSummaryFormData = z.infer<typeof talkSummaryFormSchema>;
