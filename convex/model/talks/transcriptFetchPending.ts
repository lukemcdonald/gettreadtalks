import type { Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';

export async function findOrInsertPendingTalkTranscriptFetch(
  ctx: MutationCtx,
  talkId: Id<'talks'>
) {
  const existingFetches = await ctx.db
    .query('talkTranscriptFetches')
    .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
    .collect();
  const pending = existingFetches.find((row) => row.status === 'pending');

  if (pending) {
    return pending._id;
  }

  return await ctx.db.insert('talkTranscriptFetches', {
    checkedAt: Date.now(),
    status: 'pending',
    talkId,
  });
}
