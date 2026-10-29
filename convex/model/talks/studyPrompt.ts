import { z } from 'zod';

export const talkStudyOutputSchema = z.object({
  keyPassages: z
    .array(
      z.object({
        note: z
          .string()
          .describe('One line on why this passage matters in the talk.'),
        reference: z
          .string()
          .describe('A plain scripture reference, such as Romans 8:28.'),
      })
    )
    .min(1)
    .max(8)
    .describe(
      'Ordered passages: the main text first, then in the order the argument builds on them.'
    ),
  mainPoints: z
    .array(
      z.object({
        body: z
          .string()
          .describe('One or two plain sentences. No markdown or links.'),
        heading: z.string().describe('A short heading for the point.'),
        references: z
          .array(
            z
              .string()
              .describe('A plain scripture reference, such as Romans 8:28.')
          )
          .min(1)
          .max(3)
          .describe('Verses the speaker actually uses.'),
      })
    )
    .min(3)
    .max(5)
    .describe('Three to five main points from the talk.'),
});

export interface TalkStudyPromptInput {
  scripture: string;
  speaker: string;
  title: string;
  transcript: string;
}

export function buildTalkStudyPrompt({
  scripture,
  speaker,
  title,
  transcript,
}: TalkStudyPromptInput) {
  return [
    `title: ${title}`,
    `speaker: ${speaker}`,
    `scripture: ${scripture.trim() || '(empty)'}`,
    'transcript:',
    transcript,
  ].join('\n');
}

export const TALK_STUDY_SYSTEM_PROMPT = `You are drafting study notes for a Christian sermon or talk on the TREAD Talks website. One person will study alone: personal, reflective, moving toward a next step of obedience. The notes should also work in a group.

Write from the transcript only. All text is plain: no markdown, no links, no verse quotations. References are the typed citation only (for example "Romans 8:28" or "Psalm 23:1-3"), never the verse text.

Return a JSON object with:
- mainPoints: 3 to 5 points. Each has a short heading, a sentence or two, and 1 to 3 supporting verse references. Prefer verses the speaker actually uses. Do not overwhelm.
- keyPassages: plain references with a one-line note on why each matters. Order them on purpose: the main text first (the stored scripture field when it matches the sermon), then in the order the talk's argument builds on them. No arbitrary order.

Voice
- Address the reader as someone sitting with the talk, not as a crowd.
- Warm, plain, and concrete. Point toward obedience without hype.
- Credit the speaker's argument. Do not add your own sermon.

Scripture
- Cite references in the form the site uses: "Philippians 4:4-7", "1 Corinthians 15", "Romans 3:25".
- Check every reference against the transcript. Captions often mangle numbers. Use the reference the quoted words actually come from, and leave out any you cannot confirm.
- If the scripture field does not match the sermon, follow the sermon for the main text.

Leave out
- Housekeeping, greetings, announcements, and promotional asides.
- Private individuals' names. Use a role instead.
- Your own opinions and content that is not in the talk.`;
