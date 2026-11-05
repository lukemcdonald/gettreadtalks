import type { Doc, Id } from '../../../_generated/dataModel';
import type { QueryCtx } from '../../../_generated/server';
import type { TalkStudyGenerateResult } from './generate';

import { v } from 'convex/values';

import { api } from '../../../_generated/api';
import { action, query } from '../../../_generated/server';
import { requireAdmin } from '../../auth/helpers';
import { talksByStatusQuery } from '../../talks/helpers';
import { TALK_SUMMARY_MODEL } from '../../talks/summary/prompt';
import { generateTalkStudy } from './generate';
import {
  estimateStudyGenerateCost,
  getStudyBackfillLimit,
  isStudyBackfillEligible,
  paginateStudyBackfillTalks,
} from './helpers';

const studyBackfillArgs = {
  cursor: v.optional(v.union(v.null(), v.string())),
  limit: v.optional(v.number()),
};

const studyBackfillTalkValidator = v.object({
  talkId: v.id('talks'),
  title: v.string(),
  transcriptChars: v.number(),
});

const studyBackfillCostValidator = v.object({
  estimatedCostUsd: v.number(),
  estimatedInputTokens: v.number(),
  estimatedOutputTokens: v.number(),
});

interface StudyBackfillTalk {
  scripture: string;
  speaker: string;
  talkId: Id<'talks'>;
  title: string;
  transcriptChars: number;
}

function toStudyBackfillTalk(
  talk: Doc<'talks'>,
  transcript: string
): StudyBackfillTalk {
  return {
    scripture: talk.scripture ?? '',
    speaker: '',
    talkId: talk._id,
    title: talk.title,
    transcriptChars: transcript.length,
  };
}

function toEligibleStudyBackfillTalk(
  talk: Doc<'talks'>,
  feature: Doc<'talkFeatures'> | null,
  transcript: string | undefined
) {
  if (
    !isStudyBackfillEligible({
      draftStudy: talk.draftStudy,
      feature,
      status: talk.status,
      transcript,
    })
  ) {
    return [];
  }

  return [toStudyBackfillTalk(talk, transcript?.trim() ?? '')];
}

function toStudyBackfillResult(
  result: TalkStudyGenerateResult,
  talkId: Id<'talks'>
) {
  if (result.status === 'success') {
    return {
      status: 'success' as const,
      talkId,
    };
  }

  if (result.errorCode === 'ALREADY_REVIEWED') {
    return {
      errorCode: result.errorCode,
      status: 'skipped' as const,
      talkId,
    };
  }

  return {
    errorCode: result.errorCode,
    status: 'failed' as const,
    talkId,
  };
}

async function listStudyBackfillTalks(ctx: QueryCtx) {
  const talks = await talksByStatusQuery(ctx, 'published').collect();
  const [features, transcripts] = await Promise.all([
    ctx.db.query('talkFeatures').collect(),
    ctx.db.query('talkTranscripts').collect(),
  ]);
  const featureByTalkId = new Map(
    features.flatMap((feature) =>
      feature.kind === 'study' ? [[feature.talkId, feature] as const] : []
    )
  );
  const transcriptByTalkId = new Map(
    transcripts.map((transcript) => [transcript.talkId, transcript] as const)
  );

  return talks.flatMap((talk) =>
    toEligibleStudyBackfillTalk(
      talk,
      featureByTalkId.get(talk._id) ?? null,
      transcriptByTalkId.get(talk._id)?.text
    )
  );
}

function toStudyBackfillEstimate(
  talks: StudyBackfillTalk[],
  cursor: string | null | undefined,
  limit: number
) {
  const { continueCursor, isDone, page } = paginateStudyBackfillTalks(
    talks,
    cursor,
    limit
  );
  const batch = estimateStudyGenerateCost(page);
  const total = estimateStudyGenerateCost(talks);

  return {
    batch: {
      continueCursor,
      estimatedCostUsd: batch.estimatedCostUsd,
      estimatedInputTokens: batch.estimatedInputTokens,
      estimatedOutputTokens: batch.estimatedOutputTokens,
      isDone,
      talks: page.map(({ talkId, title, transcriptChars }) => ({
        talkId,
        title,
        transcriptChars,
      })),
    },
    model: TALK_SUMMARY_MODEL,
    total: {
      eligibleCount: talks.length,
      estimatedCostUsd: total.estimatedCostUsd,
      estimatedInputTokens: total.estimatedInputTokens,
      estimatedOutputTokens: total.estimatedOutputTokens,
    },
  };
}

export const estimateStudyBackfill = query({
  args: studyBackfillArgs,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return toStudyBackfillEstimate(
      await listStudyBackfillTalks(ctx),
      args.cursor,
      getStudyBackfillLimit(args.limit)
    );
  },
  returns: v.object({
    batch: studyBackfillCostValidator.extend({
      continueCursor: v.string(),
      isDone: v.boolean(),
      talks: v.array(studyBackfillTalkValidator),
    }),
    model: v.string(),
    total: studyBackfillCostValidator.extend({
      eligibleCount: v.number(),
    }),
  }),
});

export const backfillStudies = action({
  args: studyBackfillArgs,
  handler: async (ctx, args) => {
    const estimate: ReturnType<typeof toStudyBackfillEstimate> =
      await ctx.runQuery(api.talkFeatures.estimateStudyBackfill, {
        cursor: args.cursor,
        limit: args.limit,
      });
    const results: {
      errorCode?: string;
      status: 'failed' | 'skipped' | 'success';
      talkId: Id<'talks'>;
    }[] = [];

    for (const talk of estimate.batch.talks) {
      // oxlint-disable-next-line no-await-in-loop -- generate one talk at a time to cap gateway spend
      const generated = await generateTalkStudy(ctx, talk.talkId);
      const result = toStudyBackfillResult(generated, talk.talkId);

      results.push(result);

      if (result.status === 'failed' && result.errorCode === 'TOKEN_MISSING') {
        break;
      }
    }

    return {
      continueCursor: estimate.batch.continueCursor,
      isDone: estimate.batch.isDone,
      results,
    };
  },
  returns: v.object({
    continueCursor: v.string(),
    isDone: v.boolean(),
    results: v.array(
      v.object({
        errorCode: v.optional(v.string()),
        status: v.union(
          v.literal('failed'),
          v.literal('skipped'),
          v.literal('success')
        ),
        talkId: v.id('talks'),
      })
    ),
  }),
});
