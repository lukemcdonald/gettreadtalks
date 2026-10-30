import { v } from 'convex/values';

import { internalMutation } from '../../_generated/server';
import { findOrInsertPendingTalkTranscriptFetch } from './transcriptFetchPending';

export { findOrInsertPendingTalkTranscriptFetch } from './transcriptFetchPending';

export const insertPendingTalkTranscriptFetch = internalMutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, { talkId }) =>
    await findOrInsertPendingTalkTranscriptFetch(ctx, talkId),
  returns: v.id('talkTranscriptFetches'),
});
