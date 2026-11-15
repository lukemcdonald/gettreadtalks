import type { Doc } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';

import { v } from 'convex/values';

import { internal } from '../../_generated/api';
import { internalMutation } from '../../_generated/server';

export const TALK_FORMAT_BACKFILL_PAGE_SIZE = 50;

const DEFAULT_TALK_FORMAT = 'sermon' as const;

async function fillMissingTalkFormat(
  ctx: MutationCtx,
  args: { talk: Doc<'talks'> }
) {
  if (args.talk.format !== undefined) {
    return false;
  }

  await ctx.db.patch(args.talk._id, {
    format: DEFAULT_TALK_FORMAT,
  });

  return true;
}

/** Fills a missing talk format with sermon. Safe to rerun; never overwrites a format. */
export const backfillMissingTalkFormats = internalMutation({
  args: {
    cursor: v.optional(v.union(v.null(), v.string())),
  },
  handler: async (ctx, args) => {
    const page = await ctx.db.query('talks').paginate({
      cursor: args.cursor ?? null,
      numItems: TALK_FORMAT_BACKFILL_PAGE_SIZE,
    });
    const filled = await Promise.all(
      page.page.map((talk) => fillMissingTalkFormat(ctx, { talk }))
    );
    const updated = filled.filter(Boolean).length;

    if (!page.isDone) {
      await ctx.scheduler.runAfter(
        0,
        internal.talks.backfillMissingTalkFormats,
        {
          cursor: page.continueCursor,
        }
      );
    }

    return {
      continueCursor: page.continueCursor,
      isDone: page.isDone,
      updated,
    };
  },
  returns: v.object({
    continueCursor: v.string(),
    isDone: v.boolean(),
    updated: v.number(),
  }),
});
