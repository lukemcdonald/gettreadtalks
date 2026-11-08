import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { doc } from '../../lib/validators/schema';
import { requireAdmin } from '../auth/helpers';
import { loadTalkFeature, toEligibleStudyDraftIds } from './helpers';
import { talkFeatureKind } from './validators';

export const getTalkFeature = query({
  args: {
    kind: talkFeatureKind,
    talkId: v.id('talks'),
  },
  handler: async (ctx, { kind, talkId }) => {
    await requireAdmin(ctx);

    return await loadTalkFeature(ctx, kind, talkId);
  },
  returns: doc('talkFeatures').nullable(),
});

export const listEligibleStudyDrafts = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const drafts = await ctx.db
      .query('talkFeatures')
      .withIndex('by_kind_and_status', (q) =>
        q.eq('kind', 'study').eq('status', 'draft')
      )
      .collect();

    return {
      featureIds: toEligibleStudyDraftIds(drafts),
    };
  },
  returns: v.object({
    featureIds: v.array(v.id('talkFeatures')),
  }),
});
