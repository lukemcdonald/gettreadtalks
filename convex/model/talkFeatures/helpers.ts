import type { Id } from '../../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../../_generated/server';
import type { talkFeatureKind } from './validators';
import type { Infer } from 'convex/values';

// ponytail: one mutation, not a job. Remainder stays draft for another click.
export const PUBLISH_STUDY_DRAFTS_MAX = 1000;

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
>(features: T[], max = PUBLISH_STUDY_DRAFTS_MAX) {
  const featureIds: Id<'talkFeatures'>[] = [];

  for (const feature of features) {
    if (!isEligibleStudyDraft(feature)) {
      continue;
    }

    featureIds.push(feature._id);

    if (featureIds.length === max) {
      break;
    }
  }

  return featureIds;
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
