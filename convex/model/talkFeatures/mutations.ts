import type { Id } from '../../_generated/dataModel';

import { v } from 'convex/values';

import { internalMutation, mutation } from '../../_generated/server';
import { throwConvexError } from '../../lib/errors';
import { getOrThrow } from '../../lib/utils';
import { requireAdmin } from '../auth/helpers';
import { clearTalkDraftStep } from '../talks/autoDraft';
import {
  hasReviewedTalkFeature,
  isEligibleStudyDraft,
  loadTalkFeature,
} from './helpers';
import { talkFeatureKind, talkFeatureStatus } from './validators';

export const saveTalkFeatureDraft = internalMutation({
  args: {
    body: v.string(),
    kind: talkFeatureKind,
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    await getOrThrow(ctx, {
      id: args.talkId,
      table: 'talks',
    });

    const existing = await loadTalkFeature(ctx, {
      kind: args.kind,
      talkId: args.talkId,
    });

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

    await clearTalkDraftStep(ctx, {
      step: 'study',
      talkId: args.talkId,
    });

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
    await getOrThrow(ctx, {
      id: args.talkId,
      table: 'talks',
    });

    const existing = await loadTalkFeature(ctx, {
      kind: args.kind,
      talkId: args.talkId,
    });
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

    await clearTalkDraftStep(ctx, {
      step: 'study',
      talkId: args.talkId,
    });

    return featureId;
  },
  returns: v.id('talkFeatures'),
});

export const publishStudyDrafts = mutation({
  args: {
    featureIds: v.array(v.id('talkFeatures')),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const uniqueIds = [...new Set(args.featureIds)];
    const features = await Promise.all(
      uniqueIds.map((featureId) => ctx.db.get(featureId))
    );
    const now = Date.now();
    const patches: Promise<void>[] = [];
    let published = 0;
    let skipped = 0;

    for (const feature of features) {
      if (!feature || !isEligibleStudyDraft(feature)) {
        skipped += 1;
        continue;
      }

      patches.push(
        ctx.db.patch(feature._id, {
          manuallyEditedAt: now,
          status: 'published',
          updatedAt: now,
        })
      );
      published += 1;
    }

    await Promise.all(patches);

    return { published, skipped };
  },
  returns: v.object({
    published: v.number(),
    skipped: v.number(),
  }),
});
