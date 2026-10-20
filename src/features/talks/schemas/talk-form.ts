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
  mediaUrl: z.url('Please enter a valid URL'),
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

const scriptureRefSchema = z.object({
  book: z.string(),
  chapter: z.number(),
  verseEnd: z.number().optional(),
  verseStart: z.number().optional(),
});

export const editTalkFormSchema = talkFormSchema.extend({
  study: z
    .object({
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
    })
    .optional(),
});

export type EditTalkFormData = z.infer<typeof editTalkFormSchema>;
