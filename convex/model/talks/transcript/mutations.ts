import { v } from 'convex/values';

import { internalMutation } from '../../../_generated/server';
import { findOrInsertPendingTalkTranscriptFetch } from './fetch';

export const insertPendingTalkTranscriptFetch = internalMutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, { talkId }) =>
    await findOrInsertPendingTalkTranscriptFetch(ctx, talkId),
  returns: v.id('talkTranscriptFetches'),
});
