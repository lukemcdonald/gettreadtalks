import { z } from 'zod';

import { talkFormSchema } from './talk-form';

const STUDY_GUIDE_KINDS = [
  'application',
  'discussion_question',
  'key_idea',
  'prayer',
] as const;

const scriptureRefSchema = z.object({
  book: z.string(),
  chapter: z.number(),
  verseEnd: z.number().optional(),
  verseStart: z.number().optional(),
});

export const talkStudyFormSchema = z.object({
  outline: z.array(
    z.object({
      heading: z.string(),
      text: z.string(),
    })
  ),
  scriptureRefs: z.array(scriptureRefSchema),
  studyGuide: z.array(
    z.object({
      kind: z.enum(STUDY_GUIDE_KINDS),
      scriptureRefs: z.array(scriptureRefSchema).optional(),
      text: z.string(),
    })
  ),
  suggestedTopics: z.string(),
  summary: z.string(),
});

export const editTalkFormSchema = talkFormSchema.extend({
  study: talkStudyFormSchema.optional(),
});

export type EditTalkFormData = z.infer<typeof editTalkFormSchema>;

export function formatSuggestedTopics(topics: string[]) {
  return topics.join(', ');
}

export function parseSuggestedTopics(value: string) {
  return value
    .split(',')
    .map((topic) => topic.trim())
    .filter(Boolean);
}
