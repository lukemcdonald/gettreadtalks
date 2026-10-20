import { z } from 'zod';

const scriptureRefSchema = z.object({
  book: z.string(),
  chapter: z.number(),
  verseEnd: z.number().optional(),
  verseStart: z.number().optional(),
});

export const talkStudyFormSchema = z.object({
  outline: z.array(z.object({ heading: z.string(), text: z.string() })),
  scriptureRefs: z.array(scriptureRefSchema),
  studyGuide: z.array(
    z.object({
      kind: z.enum([
        'application',
        'discussion_question',
        'key_idea',
        'prayer',
      ]),
      scriptureRefs: z.array(scriptureRefSchema).optional(),
      text: z.string(),
    })
  ),
  suggestedTopics: z.string(),
  summary: z.string(),
});

export type TalkStudyFormData = z.infer<typeof talkStudyFormSchema>;

export function parseSuggestedTopics(value: string) {
  return value
    .split(',')
    .map((topic) => topic.trim())
    .filter(Boolean);
}
