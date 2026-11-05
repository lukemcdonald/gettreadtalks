import type { MutationCtx } from '../../_generated/server';
import type { Infer } from 'convex/values';

import { v } from 'convex/values';

import { talkFields, talkTranscriptFields } from './schema';

const MEDIA_URL = 'https://www.youtube.com/watch?v=0SVTl4Xa5fY';

const talkValidator = v.object(talkFields);
const talkTranscriptValidator = v.object(talkTranscriptFields);

type TalkFields = Infer<typeof talkValidator>;
type TalkTranscriptFields = Infer<typeof talkTranscriptValidator>;

type TalkOverrides = Partial<TalkFields> & Pick<TalkFields, 'speakerId'>;
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
