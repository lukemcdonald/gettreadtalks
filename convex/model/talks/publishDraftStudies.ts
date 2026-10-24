import type { Doc } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';

import { v } from 'convex/values';

import { internalMutation } from '../../_generated/server';

const BATCH_SIZE = 64;
const TITLE_PREVIEW_LIMIT = 10;

const publishDraftStudiesResult = v.object({
  eligible: v.number(),
  isDone: v.boolean(),
  published: v.number(),
  skipped: v.number(),
  titles: v.array(v.string()),
});

function hasTalkStudySummary(summary: string) {
  return Boolean(summary.trim());
}

async function loadEligibleDraftStudies(
  ctx: MutationCtx,
  drafts: Doc<'talkStudies'>[]
) {
  const eligible = drafts.filter((study) => hasTalkStudySummary(study.summary));
  const titled = await Promise.all(
    eligible.map(async (study) => {
      const talk = await ctx.db.get(study.talkId);

      return {
        study,
        title: talk?.title ?? study.talkId,
      };
    })
  );

  titled.sort((left, right) => left.title.localeCompare(right.title));

  return titled;
}

/**
 * One-off: publish draft studies that have a summary. Dashboard: run `{}` to
 * preview, `{"dryRun": false}` to publish, repeat until isDone.
 */
export const publishDraftStudies = internalMutation({
  args: {
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? true;
    const drafts = await ctx.db
      .query('talkStudies')
      .withIndex('by_studyStatus', (q) => q.eq('studyStatus', 'draft'))
      .collect();
    const titled = await loadEligibleDraftStudies(ctx, drafts);
    const skipped = drafts.length - titled.length;
    const batch = titled.slice(0, BATCH_SIZE);
    const titles = (dryRun ? titled : batch)
      .slice(0, TITLE_PREVIEW_LIMIT)
      .map((row) => row.title);

    if (dryRun) {
      return {
        eligible: titled.length,
        isDone: titled.length === 0,
        published: 0,
        skipped,
        titles,
      };
    }

    await Promise.all(
      batch.map((row) =>
        ctx.db.patch(row.study._id, {
          studyStatus: 'published',
        })
      )
    );

    const remaining = titled.length - batch.length;

    return {
      eligible: remaining,
      isDone: remaining === 0,
      published: batch.length,
      skipped,
      titles,
    };
  },
  returns: publishDraftStudiesResult,
});
