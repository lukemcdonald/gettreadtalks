import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';

import { internalMutation } from '../../_generated/server';
import {
  isLegacyTranscriptFetchErrorCode,
  normalizeTranscriptFetchErrorCode,
} from './transcriptFetchErrorCode';

const BATCH_SIZE = 64;

const renameTalkTranscriptFetchErrorCodesResult = v.object({
  isDone: v.boolean(),
  legacyErrorCodes: v.number(),
  renamed: v.number(),
  totalFetches: v.number(),
});

function hasLegacyTranscriptFetchErrorCode(
  fetch: Doc<'talkTranscriptFetches'>
) {
  return (
    fetch.errorCode !== undefined &&
    isLegacyTranscriptFetchErrorCode(fetch.errorCode)
  );
}

/**
 * One-off: rewrite leftover lowercase transcript-fetch error codes to
 * UPPER_SNAKE_CASE. Default `dryRun: true` only reports counts.
 *
 * CLI (do not run on prod without Luke's approval):
 * - npx convex run talks:renameTalkTranscriptFetchErrorCodes '{"dryRun":true}'
 * - npx convex run talks:renameTalkTranscriptFetchErrorCodes '{"dryRun":false}'
 */
export const renameTalkTranscriptFetchErrorCodes = internalMutation({
  args: {
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? true;
    const fetches = await ctx.db.query('talkTranscriptFetches').collect();
    const legacy = fetches.filter(hasLegacyTranscriptFetchErrorCode);

    if (dryRun) {
      return {
        isDone: legacy.length === 0,
        legacyErrorCodes: legacy.length,
        renamed: 0,
        totalFetches: fetches.length,
      };
    }

    const batch = legacy.slice(0, BATCH_SIZE);

    await Promise.all(
      batch.map((fetch) => {
        const { errorCode } = fetch;

        if (!errorCode) {
          throw new Error('expected a leftover error code');
        }

        return ctx.db.patch(fetch._id, {
          errorCode: normalizeTranscriptFetchErrorCode(errorCode),
        });
      })
    );

    const remaining = legacy.length - batch.length;

    return {
      isDone: remaining === 0,
      legacyErrorCodes: remaining,
      renamed: batch.length,
      totalFetches: fetches.length,
    };
  },
  returns: renameTalkTranscriptFetchErrorCodesResult,
});
