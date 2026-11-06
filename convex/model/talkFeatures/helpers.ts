import type { Id } from '../../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../../_generated/server';
import type { talkFeatureKind } from './validators';
import type { Infer } from 'convex/values';

export function hasReviewedTalkFeature(
  feature: {
    manuallyEditedAt?: number;
    status: 'draft' | 'published';
  } | null
) {
  return (
    feature !== null &&
    (feature.status === 'published' || feature.manuallyEditedAt !== undefined)
  );
}

export async function loadTalkFeature(
  ctx: MutationCtx | QueryCtx,
  kind: Infer<typeof talkFeatureKind>,
  talkId: Id<'talks'>
) {
  return await ctx.db
    .query('talkFeatures')
    .withIndex('by_talkId_and_kind', (q) =>
      q.eq('talkId', talkId).eq('kind', kind)
    )
    .unique();
}
