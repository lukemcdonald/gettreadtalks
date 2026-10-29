import { z } from 'zod';

const talkStudyRefFormSchema = z.object({
  text: z.string(),
});

export const talkStudyFormSchema = z.object({
  studyStatus: z.enum(['draft', 'published']),
  summary: z.string(),
});

export const talkStudyContentFormSchema = z.object({
  keyPassages: z.array(
    z.object({
      note: z.string(),
      reference: talkStudyRefFormSchema,
    })
  ),
  mainPoints: z.array(
    z.object({
      body: z.string(),
      heading: z.string(),
      references: z.array(talkStudyRefFormSchema),
    })
  ),
});

export type TalkStudyFormData = z.infer<typeof talkStudyFormSchema>;
export type TalkStudyContentFormData = z.infer<
  typeof talkStudyContentFormSchema
>;
