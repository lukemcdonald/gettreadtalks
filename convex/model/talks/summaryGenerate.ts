import type { Doc, Id } from '../../_generated/dataModel';
import type { ActionCtx } from '../../_generated/server';

import { getOneFrom } from 'convex-helpers/server/relationships';
import { ConvexError, v } from 'convex/values';

import { internal } from '../../_generated/api';
import { action, internalQuery } from '../../_generated/server';
import { getOrThrow } from '../../lib/utils';
import { requireAdmin } from '../auth/roles';
import {
  buildTalkSummaryPrompt,
  TALK_SUMMARY_MODEL,
  TALK_SUMMARY_SYSTEM_PROMPT,
  talkSummaryOutputSchema,
} from './summaryPrompt';

const SUMMARY_GENERATE_MESSAGES = {
  ALREADY_REVIEWED: 'This summary has already been edited.',
  NO_TRANSCRIPT: 'A transcript is required to generate a summary.',
  TOKEN_MISSING: 'Summary service is not configured.',
  UPSTREAM_ERROR: 'Summary service returned an error.',
} as const;

const talkSummaryGenerateErrorCode = v.union(
  v.literal('ALREADY_REVIEWED'),
  v.literal('NO_TRANSCRIPT'),
  v.literal('TOKEN_MISSING'),
  v.literal('UPSTREAM_ERROR')
);

const talkSummaryGenerateFailure = v.object({
  errorCode: talkSummaryGenerateErrorCode,
  message: v.string(),
  status: v.literal('failed'),
});

type TalkSummaryGenerateErrorCode = keyof typeof SUMMARY_GENERATE_MESSAGES;

function toFailedResult(errorCode: TalkSummaryGenerateErrorCode) {
  return {
    errorCode,
    message: SUMMARY_GENERATE_MESSAGES[errorCode],
    status: 'failed' as const,
  };
}

function isConflictError(error: unknown) {
  return (
    error instanceof ConvexError &&
    (error.data as { statusCode?: number }).statusCode === 409
  );
}

export interface TalkSummarySource {
  scripture: string;
  speaker: string;
  summary: string;
  summaryManuallyEdited: boolean;
  title: string;
  transcript: string | null;
}

export type TalkGenerateGuardError =
  | 'ALREADY_REVIEWED'
  | 'NO_TRANSCRIPT'
  | 'TOKEN_MISSING';

export async function loadTalkGenerateSource(
  ctx: ActionCtx,
  talkId: Id<'talks'>
): Promise<
  | { errorCode: TalkGenerateGuardError }
  | (TalkSummarySource & { transcript: string })
> {
  const source: TalkSummarySource = await ctx.runQuery(
    internal.talks.loadTalkSummarySource,
    {
      talkId,
    }
  );

  if (!source.transcript) {
    return { errorCode: 'NO_TRANSCRIPT' };
  }

  if (source.summaryManuallyEdited) {
    return { errorCode: 'ALREADY_REVIEWED' };
  }

  if (!process.env.AI_GATEWAY_API_KEY) {
    return { errorCode: 'TOKEN_MISSING' };
  }

  return {
    ...source,
    transcript: source.transcript,
  };
}

function toTalkSummarySource(
  speaker: Doc<'speakers'>,
  talk: Doc<'talks'>,
  transcript: Doc<'talkTranscripts'> | null
): TalkSummarySource {
  return {
    scripture: talk.scripture ?? '',
    speaker: `${speaker.firstName} ${speaker.lastName}`.trim(),
    summary: talk.summary ?? '',
    summaryManuallyEdited: talk.summaryManuallyEditedAt !== undefined,
    title: talk.title,
    transcript: transcript?.text?.trim() || null,
  };
}

export const loadTalkSummarySource = internalQuery({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, { talkId }) => {
    await requireAdmin(ctx);

    const talk = await getOrThrow(ctx, 'talks', talkId);
    const speaker = await getOrThrow(ctx, 'speakers', talk.speakerId);
    const transcript = await getOneFrom(
      ctx.db,
      'talkTranscripts',
      'by_talkId',
      talkId
    );

    return toTalkSummarySource(speaker, talk, transcript);
  },
  returns: v.object({
    scripture: v.string(),
    speaker: v.string(),
    summary: v.string(),
    summaryManuallyEdited: v.boolean(),
    title: v.string(),
    transcript: v.union(v.null(), v.string()),
  }),
});

async function generateTalkSummaryObject(input: {
  scripture: string;
  speaker: string;
  title: string;
  transcript: string;
}) {
  const { generateObject } = await import('ai');
  const { object } = await generateObject({
    model: TALK_SUMMARY_MODEL,
    prompt: buildTalkSummaryPrompt(input),
    schema: talkSummaryOutputSchema,
    system: TALK_SUMMARY_SYSTEM_PROMPT,
  });

  return object;
}

export const talkSummaryGenerator = {
  generate: generateTalkSummaryObject,
};

async function saveGeneratedTalkSummary(
  ctx: ActionCtx,
  source: TalkSummarySource & { transcript: string },
  talkId: Id<'talks'>
) {
  let generated: { flags: string[]; summary: string };

  try {
    generated = await talkSummaryGenerator.generate({
      scripture: source.scripture,
      speaker: source.speaker,
      title: source.title,
      transcript: source.transcript,
    });
  } catch {
    return toFailedResult('UPSTREAM_ERROR');
  }

  try {
    await ctx.runMutation(internal.talks.saveTalkSummaryDraft, {
      generator: TALK_SUMMARY_MODEL,
      summary: generated.summary,
      talkId,
    });
  } catch (error) {
    if (isConflictError(error)) {
      return toFailedResult('ALREADY_REVIEWED');
    }

    return toFailedResult('UPSTREAM_ERROR');
  }

  return {
    flags: generated.flags,
    status: 'success' as const,
    summary: generated.summary,
  };
}

export const generateTalkSummary = action({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (
    ctx,
    { talkId }
  ): Promise<
    | {
        errorCode: TalkSummaryGenerateErrorCode;
        message: string;
        status: 'failed';
      }
    | { flags: string[]; status: 'success'; summary: string }
  > => {
    const source = await loadTalkGenerateSource(ctx, talkId);

    if ('errorCode' in source) {
      return toFailedResult(source.errorCode);
    }

    return await saveGeneratedTalkSummary(ctx, source, talkId);
  },
  returns: v.union(
    talkSummaryGenerateFailure,
    v.object({
      flags: v.array(v.string()),
      status: v.literal('success'),
      summary: v.string(),
    })
  ),
});
