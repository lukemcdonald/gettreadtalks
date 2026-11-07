import type { Doc, Id } from '../../../_generated/dataModel';
import type { ActionCtx, QueryCtx } from '../../../_generated/server';
import type { TalkStudyGenerateResult } from './generate';

import { getOneFrom } from 'convex-helpers/server/relationships';
import { v } from 'convex/values';

import { api } from '../../../_generated/api';
import { action, query } from '../../../_generated/server';
import { ErrorCodes } from '../../../lib/errors';
import { reportSentryException } from '../../../lib/sentry';
import { formatErrorMessage } from '../../../lib/utils';
import { requireAdmin } from '../../auth/helpers';
import { talksByStatusQuery } from '../../talks/helpers';
import { TALK_SUMMARY_MODEL } from '../../talks/summary/prompt';
import { TALK_DRAFT_PENDING } from '../../talks/validators';
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

function formatSpeakerName(
  speaker: Pick<Doc<'speakers'>, 'firstName' | 'lastName'> | null
) {
  if (!speaker) {
    return '';
  }

  return `${speaker.firstName} ${speaker.lastName}`.trim();
}

function toStudyBackfillTalk(
  speakerName: string,
  talk: Doc<'talks'>,
  transcript: string
): StudyBackfillTalk {
  return {
    scripture: talk.scripture ?? '',
    speaker: speakerName,
    talkId: talk._id,
    title: talk.title,
    transcriptChars: transcript.length,
  };
}

export const studyBackfillGenerator = {
  generate: generateTalkStudy,
};

const studyBackfillResultValidator = v.object({
  errorCode: v.optional(v.string()),
  status: v.union(
    v.literal('failed'),
    v.literal('skipped'),
    v.literal('success')
  ),
  talkId: v.id('talks'),
  title: v.string(),
});

interface StudyBackfillResult {
  errorCode?: string;
  status: 'failed' | 'skipped' | 'success';
  talkId: Id<'talks'>;
  title: string;
}

function toStudyBackfillResult(
  result: TalkStudyGenerateResult,
  talk: { talkId: Id<'talks'>; title: string }
): StudyBackfillResult {
  if (result.status === 'success') {
    return {
      status: 'success',
      talkId: talk.talkId,
      title: talk.title,
    };
  }

  if (result.errorCode === 'ALREADY_REVIEWED') {
    return {
      errorCode: result.errorCode,
      status: 'skipped',
      talkId: talk.talkId,
      title: talk.title,
    };
  }

  return {
    errorCode: result.errorCode,
    status: 'failed',
    talkId: talk.talkId,
    title: talk.title,
  };
}

async function generateStudyBackfillResult(
  ctx: ActionCtx,
  talk: { talkId: Id<'talks'>; title: string }
): Promise<StudyBackfillResult> {
  try {
    return toStudyBackfillResult(
      await studyBackfillGenerator.generate(ctx, talk.talkId),
      talk
    );
  } catch (error) {
    await reportSentryException({
      message: `Study backfill failed: ${formatErrorMessage(error)}`,
      tags: {
        errorCode: ErrorCodes.SERVER_ERROR,
        operation: 'backfillStudies',
      },
    });

    return {
      errorCode: ErrorCodes.SERVER_ERROR,
      status: 'failed',
      talkId: talk.talkId,
      title: talk.title,
    };
  }
}

async function loadStudyBackfillTalk(ctx: QueryCtx, talk: Doc<'talks'>) {
  if (talk.draftStudy === TALK_DRAFT_PENDING) {
    return null;
  }

  const feature = await ctx.db
    .query('talkFeatures')
    .withIndex('by_talkId_and_kind', (q) =>
      q.eq('talkId', talk._id).eq('kind', 'study')
    )
    .unique();

  if (feature !== null) {
    return null;
  }

  const transcript = await getOneFrom(
    ctx.db,
    'talkTranscripts',
    'by_talkId',
    talk._id
  );

  if (
    !isStudyBackfillEligible({
      draftStudy: talk.draftStudy,
      feature,
      status: talk.status,
      transcript: transcript?.text,
    })
  ) {
    return null;
  }

  const speaker = await ctx.db.get('speakers', talk.speakerId);

  return toStudyBackfillTalk(
    formatSpeakerName(speaker),
    talk,
    transcript?.text?.trim() ?? ''
  );
}

async function listStudyBackfillTalks(ctx: QueryCtx) {
  const talks = await talksByStatusQuery(ctx, 'published').collect();
  const eligible = await Promise.all(
    talks.map(async (talk) => await loadStudyBackfillTalk(ctx, talk))
  );

  return {
    eligible: eligible.filter((talk) => talk !== null),
    orderedIds: talks.map((talk) => talk._id),
  };
}

function toStudyBackfillEstimate(
  eligible: StudyBackfillTalk[],
  orderedIds: string[],
  cursor: string | null | undefined,
  limit: number
) {
  const { continueCursor, isDone, page } = paginateStudyBackfillTalks({
    cursor,
    eligible,
    limit,
    orderedIds,
  });
  const batch = estimateStudyGenerateCost(page);
  const total = estimateStudyGenerateCost(eligible);

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
      eligibleCount: eligible.length,
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

    const { eligible, orderedIds } = await listStudyBackfillTalks(ctx);

    return toStudyBackfillEstimate(
      eligible,
      orderedIds,
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
    const results: StudyBackfillResult[] = [];
    let { continueCursor } = estimate.batch;
    let { isDone } = estimate.batch;

    for (const talk of estimate.batch.talks) {
      // oxlint-disable-next-line no-await-in-loop -- generate one talk at a time to cap gateway spend
      const result = await generateStudyBackfillResult(ctx, talk);

      results.push(result);

      if (
        result.status === 'failed' &&
        (result.errorCode === 'TOKEN_MISSING' ||
          result.errorCode === ErrorCodes.SERVER_ERROR)
      ) {
        continueCursor = results.at(-2)?.talkId ?? args.cursor ?? '';
        isDone = false;
        break;
      }
    }

    return {
      continueCursor,
      isDone,
      results,
    };
  },
  returns: v.object({
    continueCursor: v.string(),
    isDone: v.boolean(),
    results: v.array(studyBackfillResultValidator),
  }),
});
