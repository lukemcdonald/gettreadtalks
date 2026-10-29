import type { MutationCtx } from '../../_generated/server';
import type { Infer } from 'convex/values';

import { v } from 'convex/values';

import { talkFields, talkStudyFields, talkTranscriptFields } from './schema';

const MEDIA_URL = 'https://www.youtube.com/watch?v=0SVTl4Xa5fY';

const talkValidator = v.object(talkFields);
const talkStudyValidator = v.object(talkStudyFields);
const talkTranscriptValidator = v.object(talkTranscriptFields);

type TalkFields = Infer<typeof talkValidator>;
type TalkStudyFields = Infer<typeof talkStudyValidator>;
type TalkTranscriptFields = Infer<typeof talkTranscriptValidator>;

type TalkOverrides = Partial<TalkFields> & Pick<TalkFields, 'speakerId'>;
type TalkStudyOverrides = Partial<TalkStudyFields> &
  Pick<TalkStudyFields, 'talkId'>;
type TalkTranscriptOverrides = Partial<TalkTranscriptFields> &
  Pick<TalkTranscriptFields, 'talkId'>;

export function makeTalk(overrides: TalkOverrides): TalkFields {
  return {
    mediaUrl: MEDIA_URL,
    slug: 'grace-abounding',
    status: 'published',
    title: 'Grace Abounding',
    ...overrides,
  };
}

export async function insertTalk(ctx: MutationCtx, overrides: TalkOverrides) {
  return await ctx.db.insert('talks', makeTalk(overrides));
}

export function makeTalkStudy(overrides: TalkStudyOverrides): TalkStudyFields {
  return {
    generatedAt: Date.now(),
    generator: 'test',
    outline: [{ heading: 'Grace', text: 'Grace is a gift' }],
    scriptureRefs: [{ book: 'Romans', chapter: 5, verseStart: 1 }],
    studyGuide: [{ kind: 'key_idea', text: 'Grace' }],
    studyStatus: 'draft',
    suggestedTopics: ['grace'],
    summary: 'A draft summary.',
    ...overrides,
  };
}

export async function insertTalkStudy(
  ctx: MutationCtx,
  overrides: TalkStudyOverrides
) {
  return await ctx.db.insert('talkStudies', makeTalkStudy(overrides));
}

export function makeTalkTranscript(
  overrides: TalkTranscriptOverrides
): TalkTranscriptFields {
  return {
    source: 'manual',
    status: 'done',
    text: 'A transcript',
    ...overrides,
  };
}

export async function insertTalkTranscript(
  ctx: MutationCtx,
  overrides: TalkTranscriptOverrides
) {
  return await ctx.db.insert('talkTranscripts', makeTalkTranscript(overrides));
}
