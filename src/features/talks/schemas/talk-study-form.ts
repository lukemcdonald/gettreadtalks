import { z } from 'zod';

export const talkStudyFormSchema = z.object({
  studyStatus: z.enum(['draft', 'published']),
  summary: z.string(),
});

export type TalkStudyFormData = z.infer<typeof talkStudyFormSchema>;
