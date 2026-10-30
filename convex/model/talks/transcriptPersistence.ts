import type { Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';

import { v } from 'convex/values';

import { internalMutation } from '../../_generated/server';
import { talkTranscriptFetchErrorCode } from './validators';

export async function replaceTalkTranscriptText(
  ctx: MutationCtx,
  talkId: Id<'talks'>,
  text: string
) {
  const existing = await ctx.db
    .query('talkTranscripts')
    .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
    .unique();
  const fields = {
    fetchedAt: Date.now(),
    source: 'youtube_captions' as const,
    status: 'done' as const,
    talkId,
    text,
  };

  if (existing) {
    await ctx.db.replace(existing._id, fields);

    return;
  }

  await ctx.db.insert('talkTranscripts', fields);
}

export const saveTalkTranscriptFetchOutcome = internalMutation({
  args: {
    errorCode: v.optional(talkTranscriptFetchErrorCode),
    message: v.optional(v.string()),
    retryAfter: v.optional(v.number()),
    status: v.union(v.literal('failed'), v.literal('success')),
    talkId: v.id('talks'),
    text: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('talkTranscriptFetches', {
      checkedAt: Date.now(),
      errorCode: args.errorCode,
      message: args.message,
      retryAfter: args.retryAfter,
      status: args.status,
      talkId: args.talkId,
    });

    if (args.status === 'success' && args.text) {
      await replaceTalkTranscriptText(ctx, args.talkId, args.text);
    }

    return null;
  },
  returns: v.null(),
});
