import type { Id } from '../../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../../_generated/server';
import type { talkFeatureKind } from './validators';
import type { Infer } from 'convex/values';

export function isEligibleStudyDraft(feature: {
  body: string;
  kind: string;
  status: string;
}) {
  return (
    feature.kind === 'study' &&
    feature.status === 'draft' &&
    feature.body.trim() !== ''
  );
}

export function toEligibleStudyDraftIds<
  T extends {
    _id: Id<'talkFeatures'>;
    body: string;
    kind: string;
    status: string;
  },
>(features: T[]) {
  return features
    .filter((feature) => isEligibleStudyDraft(feature))
    .map((feature) => feature._id);
}

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
  {
    kind,
    talkId,
  }: {
    kind: Infer<typeof talkFeatureKind>;
    talkId: Id<'talks'>;
  }
) {
  return await ctx.db
    .query('talkFeatures')
    .withIndex('by_talkId_and_kind', (q) =>
      q.eq('talkId', talkId).eq('kind', kind)
    )
    .unique();
}

export function toTalkFeatureProgress(
  feature: {
    body: string;
    status: 'draft' | 'published';
  } | null
) {
  if (!feature) {
    return null;
  }

  return {
    hasBody: feature.body.trim() !== '',
    status: feature.status,
  };
}
