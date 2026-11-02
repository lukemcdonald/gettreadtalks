import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { doc } from '../../lib/validators/schema';
import { requireAdmin } from '../auth/helpers';
import { talkFeatureKind } from './validators';

export const getTalkFeature = query({
  args: {
    kind: talkFeatureKind,
    talkId: v.id('talks'),
  },
  handler: async (ctx, { kind, talkId }) => {
    await requireAdmin(ctx);

    return await ctx.db
      .query('talkFeatures')
      .withIndex('by_talkId_and_kind', (q) =>
        q.eq('talkId', talkId).eq('kind', kind)
      )
      .unique();
  },
  returns: doc('talkFeatures').nullable(),
});
