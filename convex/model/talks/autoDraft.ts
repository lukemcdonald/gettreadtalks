import type { Id } from '../../_generated/dataModel';
import type { ActionCtx, MutationCtx } from '../../_generated/server';

import { v } from 'convex/values';

import { internal } from '../../_generated/api';
import { internalAction, internalMutation } from '../../_generated/server';
import { getOrThrow } from '../../lib/utils';
import {
  saveGeneratedTalkStudy,
  STUDY_GENERATE_MESSAGES,
} from '../talkFeatures/study/generate';
import {
  saveGeneratedTalkSummary,
  SUMMARY_GENERATE_MESSAGES,
} from './summaryGenerate';
import { talkAutoDraftStepStatus } from './validators';

type DraftStep = 'study' | 'summary';

interface TalkDraftSource {
  mediaUrl: string;
  scripture: string;
  speaker: string;
  studyBody: string;
  studyReviewed: boolean;
  summary: string;
  summaryManuallyEdited: boolean;
  title: string;
  transcript: string | null;
}

interface DraftAutoDraft {
  studyMessage?: string;
  studyStatus?: 'failed' | 'pending';
  summaryMessage?: string;
  summaryStatus?: 'failed' | 'pending';
}

type DraftGenerateResult =
  | { errorCode: string; message: string; status: 'failed' }
  | { status: 'success' };

function shouldSkipAutoDraftSummary(source: TalkDraftSource) {
  if (source.summaryManuallyEdited) {
    return true;
  }

  return source.summary.trim().length > 0;
}

function shouldSkipAutoDraftStudy(source: TalkDraftSource) {
  if (source.studyReviewed) {
    return true;
  }

  return source.studyBody.trim().length > 0;
}

function toAutoDraftPatch(
  current: DraftAutoDraft,
  step: DraftStep,
  status: 'failed' | 'pending' | undefined,
  message: string | undefined
) {
  const next: DraftAutoDraft = {
    studyMessage: current.studyMessage,
    studyStatus: current.studyStatus,
    summaryMessage: current.summaryMessage,
    summaryStatus: current.summaryStatus,
  };

  if (step === 'study') {
    next.studyMessage = status === 'failed' ? message : undefined;
    next.studyStatus = status;
  } else {
    next.summaryMessage = status === 'failed' ? message : undefined;
    next.summaryStatus = status;
  }

  if (!(next.studyStatus || next.summaryStatus)) {
    return;
  }

  return {
    ...(next.studyMessage ? { studyMessage: next.studyMessage } : {}),
    ...(next.studyStatus ? { studyStatus: next.studyStatus } : {}),
    ...(next.summaryMessage ? { summaryMessage: next.summaryMessage } : {}),
    ...(next.summaryStatus ? { summaryStatus: next.summaryStatus } : {}),
  };
}

export async function clearTalkAutoDraftStep(
  ctx: MutationCtx,
  talkId: Id<'talks'>,
  step: DraftStep
) {
  const talk = await ctx.db.get(talkId);

  if (!talk?.autoDraft) {
    return;
  }

  await ctx.db.patch(talkId, {
    autoDraft: toAutoDraftPatch(talk.autoDraft, step, undefined, undefined),
  });
}

export const setTalkAutoDraftStep = internalMutation({
  args: {
    message: v.optional(v.string()),
    status: v.optional(talkAutoDraftStepStatus),
    step: v.union(v.literal('study'), v.literal('summary')),
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    const talk = await getOrThrow(ctx, 'talks', args.talkId);

    await ctx.db.patch(args.talkId, {
      autoDraft: toAutoDraftPatch(
        talk.autoDraft ?? {},
        args.step,
        args.status,
        args.message
      ),
    });

    return null;
  },
  returns: v.null(),
});

async function recordDraftStep(
  ctx: ActionCtx,
  talkId: Id<'talks'>,
  step: DraftStep,
  result: DraftGenerateResult
) {
  if (result.status === 'failed' && result.errorCode !== 'ALREADY_REVIEWED') {
    await ctx.runMutation(internal.talks.setTalkAutoDraftStep, {
      message: result.message,
      status: 'failed',
      step,
      talkId,
    });

    return;
  }

  await ctx.runMutation(internal.talks.setTalkAutoDraftStep, {
    step,
    talkId,
  });
}

async function draftMissingStep(
  ctx: ActionCtx,
  talkId: Id<'talks'>,
  step: DraftStep,
  source: TalkDraftSource,
  messages: { NO_TRANSCRIPT_SOURCE: string; TOKEN_MISSING: string },
  generate: (transcript: string) => Promise<DraftGenerateResult>
) {
  await ctx.runMutation(internal.talks.setTalkAutoDraftStep, {
    status: 'pending',
    step,
    talkId,
  });

  const transcript = source.transcript?.trim();

  if (!transcript) {
    await recordDraftStep(ctx, talkId, step, {
      errorCode: 'NO_TRANSCRIPT_SOURCE',
      message: messages.NO_TRANSCRIPT_SOURCE,
      status: 'failed',
    });

    return;
  }

  if (!process.env.AI_GATEWAY_API_KEY) {
    await recordDraftStep(ctx, talkId, step, {
      errorCode: 'TOKEN_MISSING',
      message: messages.TOKEN_MISSING,
      status: 'failed',
    });

    return;
  }

  await recordDraftStep(ctx, talkId, step, await generate(transcript));
}

export const draftTalkSummaryAndStudy = internalAction({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, { talkId }) => {
    const source: TalkDraftSource = await ctx.runQuery(
      internal.talks.loadTalkDraftSource,
      { talkId }
    );

    if (!shouldSkipAutoDraftSummary(source)) {
      await draftMissingStep(
        ctx,
        talkId,
        'summary',
        source,
        SUMMARY_GENERATE_MESSAGES,
        async (transcript) =>
          await saveGeneratedTalkSummary(ctx, { ...source, transcript }, talkId)
      );
    }

    const fresh: TalkDraftSource = await ctx.runQuery(
      internal.talks.loadTalkDraftSource,
      { talkId }
    );

    if (!shouldSkipAutoDraftStudy(fresh)) {
      await draftMissingStep(
        ctx,
        talkId,
        'study',
        fresh,
        STUDY_GENERATE_MESSAGES,
        async (transcript) =>
          await saveGeneratedTalkStudy(ctx, { ...fresh, transcript }, talkId)
      );
    }

    return null;
  },
  returns: v.null(),
});
