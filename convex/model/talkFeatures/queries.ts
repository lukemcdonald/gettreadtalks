import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { doc } from '../../lib/validators/schema';
import { requireAdmin } from '../auth/helpers';
import { loadTalkFeature } from './helpers';
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
