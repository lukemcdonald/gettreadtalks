import type { Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';

import { v } from 'convex/values';

import { internalMutation, mutation } from '../../_generated/server';
import { throwConvexError } from '../../lib/errors';
import { getOrThrow } from '../../lib/utils';
import { requireAdmin } from '../auth/helpers';
import { clearTalkDraftStep } from '../talks/autoDraft';
import { hasReviewedTalkFeature } from './helpers';
import { talkFeatureKind, talkFeatureStatus } from './validators';

async function getTalkFeature(
  ctx: MutationCtx,
  kind: 'study',
  talkId: Id<'talks'>
) {
  return await ctx.db
    .query('talkFeatures')
    .withIndex('by_talkId_and_kind', (q) =>
      q.eq('talkId', talkId).eq('kind', kind)
    )
    .unique();
}

export const saveTalkFeatureDraft = internalMutation({
  args: {
    body: v.string(),
    kind: talkFeatureKind,
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    await getOrThrow(ctx, 'talks', args.talkId);

    const existing = await getTalkFeature(ctx, args.kind, args.talkId);

    if (hasReviewedTalkFeature(existing)) {
      throwConvexError(409, 'Study already reviewed');
    }

    const now = Date.now();
    const fields = {
      body: args.body,
      generatedAt: now,
      kind: args.kind,
      status: 'draft' as const,
      talkId: args.talkId,
      updatedAt: now,
    };

    let featureId: Id<'talkFeatures'>;

    if (existing) {
      await ctx.db.replace(existing._id, fields);
      featureId = existing._id;
    } else {
      featureId = await ctx.db.insert('talkFeatures', fields);
    }

    await clearTalkDraftStep(ctx, args.talkId, 'study');

    return featureId;
  },
  returns: v.id('talkFeatures'),
});

export const updateTalkFeature = mutation({
  args: {
    body: v.string(),
    kind: talkFeatureKind,
    status: talkFeatureStatus,
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await getOrThrow(ctx, 'talks', args.talkId);

    const existing = await getTalkFeature(ctx, args.kind, args.talkId);
    const now = Date.now();
    let featureId: Id<'talkFeatures'>;

    if (existing) {
      await ctx.db.patch(existing._id, {
        body: args.body,
        manuallyEditedAt: now,
        status: args.status,
        updatedAt: now,
      });
      featureId = existing._id;
    } else {
      featureId = await ctx.db.insert('talkFeatures', {
        body: args.body,
        generatedAt: now,
        kind: args.kind,
        manuallyEditedAt: now,
        status: args.status,
        talkId: args.talkId,
        updatedAt: now,
      });
    }

    await clearTalkDraftStep(ctx, args.talkId, 'study');

    return featureId;
  },
  returns: v.id('talkFeatures'),
});
