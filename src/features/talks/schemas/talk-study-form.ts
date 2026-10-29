import { z } from 'zod';

export const talkFeatureFormSchema = z.object({
  body: z.string(),
  status: z.enum(['draft', 'published']),
});

export const talkStudyFormSchema = z.object({
  studyStatus: z.enum(['draft', 'published']),
  summary: z.string(),
});

export type TalkFeatureFormData = z.infer<typeof talkFeatureFormSchema>;
export type TalkStudyFormData = z.infer<typeof talkStudyFormSchema>;
