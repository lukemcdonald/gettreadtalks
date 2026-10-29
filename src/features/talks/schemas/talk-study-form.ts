import { z } from 'zod';

export const talkStudyFormSchema = z.object({
  studyStatus: z.enum(['draft', 'published']),
  summary: z.string(),
});

export const talkStudyContentFormSchema = z.object({
  keyPassages: z.array(
    z.object({
      note: z.string(),
      reference: z.string(),
    })
  ),
  mainPoints: z.array(
    z.object({
      body: z.string(),
      heading: z.string(),
      references: z.array(z.string()),
    })
  ),
});

export type TalkStudyFormData = z.infer<typeof talkStudyFormSchema>;
export type TalkStudyContentFormData = z.infer<
  typeof talkStudyContentFormSchema
>;
