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
import { TALK_DRAFT_PENDING } from './validators';

type DraftStep = 'study' | 'summary';

interface DraftSource {
  mediaUrl: string;
  scripture: string;
  speaker: string;
  summary: string;
  summaryManuallyEdited: boolean;
  title: string;
  transcript: string | null;
}

type DraftResult =
  | { errorCode: string; message: string; status: 'failed' }
  | { status: 'success' };

function hasExistingDraft(text: string | null | undefined, locked: boolean) {
  return locked || Boolean(text?.trim());
}

export async function clearTalkDraftStep(
  ctx: MutationCtx,
  {
    step,
    talkId,
  }: {
    step: DraftStep;
    talkId: Id<'talks'>;
  }
) {
  await ctx.db.patch(
    talkId,
    step === 'study' ? { draftStudy: undefined } : { draftSummary: undefined }
  );
}

export const setTalkDraftStep = internalMutation({
  args: {
    step: v.union(v.literal('study'), v.literal('summary')),
    talkId: v.id('talks'),
    value: v.optional(v.string()),
  },
  handler: async (ctx, { step, talkId, value }) => {
    await getOrThrow(ctx, {
      id: talkId,
      table: 'talks',
    });

    if (value === undefined) {
      await clearTalkDraftStep(ctx, {
        step,
        talkId,
      });

      return null;
    }

    await ctx.db.patch(
      talkId,
      step === 'study' ? { draftStudy: value } : { draftSummary: value }
    );

    return null;
  },
  returns: v.null(),
});

async function draftStep(
  ctx: ActionCtx,
  {
    save,
    source,
    step,
    talkId,
  }: {
    save: (transcript: string) => Promise<DraftResult>;
    source: DraftSource;
    step: DraftStep;
    talkId: Id<'talks'>;
  }
) {
  await ctx.runMutation(internal.talks.setTalkDraftStep, {
    step,
    talkId,
    value: TALK_DRAFT_PENDING,
  });

  const transcript = source.transcript?.trim();
  const messages =
    step === 'summary' ? SUMMARY_GENERATE_MESSAGES : STUDY_GENERATE_MESSAGES;

  if (!transcript || !process.env.AI_GATEWAY_API_KEY) {
    await ctx.runMutation(internal.talks.setTalkDraftStep, {
      step,
      talkId,
      value: transcript
        ? messages.TOKEN_MISSING
        : messages.NO_TRANSCRIPT_SOURCE,
    });

    return;
  }

  const result = await save(transcript);
  const failed =
    result.status === 'failed' && result.errorCode !== 'ALREADY_REVIEWED';

  if (failed) {
    await ctx.runMutation(internal.talks.setTalkDraftStep, {
      step,
      talkId,
      value: result.message,
    });

    return;
  }

  if (step === 'study') {
    await ctx.runMutation(internal.talks.setTalkDraftStep, {
      step,
      talkId,
    });
  }
}

export const draftTalkSummaryAndStudy = internalAction({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, { talkId }) => {
    const source = await ctx.runQuery(internal.talks.loadTalkDraftSource, {
      talkId,
    });

    await (hasExistingDraft(source.summary, source.summaryManuallyEdited)
      ? ctx.runMutation(internal.talks.setTalkDraftStep, {
          step: 'summary',
          talkId,
        })
      : draftStep(ctx, {
          save: async (transcript) =>
            await saveGeneratedTalkSummary(ctx, {
              source: { ...source, transcript },
              talkId,
            }),
          source,
          step: 'summary',
          talkId,
        }));

    const fresh = await ctx.runQuery(internal.talks.loadTalkDraftSource, {
      talkId,
    });

    await (hasExistingDraft(fresh.studyBody, fresh.studyReviewed)
      ? ctx.runMutation(internal.talks.setTalkDraftStep, {
          step: 'study',
          talkId,
        })
      : draftStep(ctx, {
          save: async (transcript) =>
            await saveGeneratedTalkStudy(ctx, {
              source: { ...fresh, transcript },
              talkId,
            }),
          source: fresh,
          step: 'study',
          talkId,
        }));

    return null;
  },
  returns: v.null(),
});
