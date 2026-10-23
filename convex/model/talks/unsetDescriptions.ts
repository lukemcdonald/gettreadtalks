import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';

import { internalMutation } from '../../_generated/server';

const BATCH_SIZE = 64;

const unsetTalkDescriptionsResult = v.object({
  isDone: v.boolean(),
  publishedTalksWithoutPublishedSummary: v.number(),
  talksWithDescription: v.number(),
  totalTalks: v.number(),
  unset: v.number(),
});

function hasTalkDescription(talk: Doc<'talks'>) {
  return talk.description !== undefined;
}

/**
 * One-off: unset leftover talk `description` fields so the schema field can
 * be removed. Default `dryRun: true` only reports counts.
 */
export const unsetTalkDescriptions = internalMutation({
  args: {
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? true;
    const talks = await ctx.db.query('talks').collect();
    const studies = await ctx.db.query('talkStudies').collect();
    const publishedSummaryTalkIds = new Set(
      studies
        .filter(
          (study) => study.studyStatus === 'published' && study.summary.trim()
        )
        .map((study) => study.talkId)
    );
    const talksWithDescription = talks.filter(hasTalkDescription);
    const publishedTalksWithoutPublishedSummary = talks.filter(
      (talk) =>
        talk.status === 'published' && !publishedSummaryTalkIds.has(talk._id)
    ).length;

    if (dryRun) {
      return {
        isDone: talksWithDescription.length === 0,
        publishedTalksWithoutPublishedSummary,
        talksWithDescription: talksWithDescription.length,
        totalTalks: talks.length,
        unset: 0,
      };
    }

    const batch = talksWithDescription.slice(0, BATCH_SIZE);

    await Promise.all(
      batch.map((talk) => {
        const {
          _creationTime,
          _id,
          description: _description,
          ...fields
        } = talk;

        return ctx.db.replace(_id, fields);
      })
    );

    const remaining = talksWithDescription.length - batch.length;

    return {
      isDone: remaining === 0,
      publishedTalksWithoutPublishedSummary,
      talksWithDescription: remaining,
      totalTalks: talks.length,
      unset: batch.length,
    };
  },
  returns: unsetTalkDescriptionsResult,
});
