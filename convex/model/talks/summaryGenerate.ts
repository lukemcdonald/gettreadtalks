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
import { talkStudyContentFields } from './validators';

const SUMMARY_GENERATE_MESSAGES = {
  ALREADY_REVIEWED: 'This study has already been reviewed.',
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

function toFailedResult(
  errorCode: TalkSummaryGenerateErrorCode,
  message: string = SUMMARY_GENERATE_MESSAGES[errorCode]
) {
  return {
    errorCode,
    message,
    status: 'failed' as const,
  };
}

function sanitizeUpstreamText(value: string) {
  return value
    .replaceAll(/AI_GATEWAY[A-Z0-9_]*/gu, '[redacted]')
    .replaceAll(/Bearer\s+\S+/giu, '[redacted]');
}

function formatUpstreamErrorDetail(error: unknown) {
  if (!(error instanceof Error)) {
    return `name=${typeof error}`;
  }

  const record = error as Error & {
    data?: { error?: { type?: string }; type?: string };
    statusCode?: number;
  };
  const parts = [`name=${error.name}`];
  const type = record.data?.error?.type ?? record.data?.type;

  if (typeof record.statusCode === 'number') {
    parts.push(`status=${record.statusCode}`);
  }

  if (type) {
    parts.push(`type=${sanitizeUpstreamText(type)}`);
  }

  parts.push(`message=${sanitizeUpstreamText(error.message)}`);

  return parts.join(' ');
}

function hasReviewedTalkStudy(study: {
  manuallyEditedAt?: number;
  studyStatus: 'draft' | 'published';
}) {
  return (
    study.studyStatus === 'published' || study.manuallyEditedAt !== undefined
  );
}

function isConflictError(error: unknown) {
  return (
    error instanceof ConvexError &&
    (error.data as { statusCode?: number }).statusCode === 409
  );
}

function getTalkStudyDraftFields(study: Doc<'talkStudies'> | null) {
  if (!study) {
    return {
      outline: [],
      scriptureRefs: [],
      studyGuide: [],
      studyReviewed: false,
      suggestedTopics: [],
    };
  }

  return {
    outline: study.outline,
    scriptureRefs: study.scriptureRefs,
    studyGuide: study.studyGuide,
    studyReviewed: hasReviewedTalkStudy(study),
    suggestedTopics: study.suggestedTopics,
  };
}

interface TalkSummarySource {
  outline: Doc<'talkStudies'>['outline'];
  scripture: string;
  scriptureRefs: Doc<'talkStudies'>['scriptureRefs'];
  speaker: string;
  studyGuide: Doc<'talkStudies'>['studyGuide'];
  studyReviewed: boolean;
  suggestedTopics: Doc<'talkStudies'>['suggestedTopics'];
  title: string;
  transcript: string | null;
}

function toTalkSummarySource(
  speaker: Doc<'speakers'>,
  study: Doc<'talkStudies'> | null,
  talk: Doc<'talks'>,
  transcript: Doc<'talkTranscripts'> | null
): TalkSummarySource {
  return {
    ...getTalkStudyDraftFields(study),
    scripture: talk.scripture ?? '',
    speaker: `${speaker.firstName} ${speaker.lastName}`.trim(),
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
    const [study, transcript] = await Promise.all([
      getOneFrom(ctx.db, 'talkStudies', 'by_talkId', talkId),
      getOneFrom(ctx.db, 'talkTranscripts', 'by_talkId', talkId),
    ]);

    return toTalkSummarySource(speaker, study, talk, transcript);
  },
  returns: v.object({
    outline: talkStudyContentFields.outline,
    scripture: v.string(),
    scriptureRefs: talkStudyContentFields.scriptureRefs,
    speaker: v.string(),
    studyGuide: talkStudyContentFields.studyGuide,
    studyReviewed: v.boolean(),
    suggestedTopics: talkStudyContentFields.suggestedTopics,
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
  } catch (error) {
    const detail = formatUpstreamErrorDetail(error);
    console.error('talkSummaryGenerate upstream', detail);

    return toFailedResult(
      'UPSTREAM_ERROR',
      `${SUMMARY_GENERATE_MESSAGES.UPSTREAM_ERROR} ${detail}`
    );
  }

  try {
    await ctx.runMutation(internal.talks.saveTalkStudyDraft, {
      generator: TALK_SUMMARY_MODEL,
      outline: source.outline,
      scriptureRefs: source.scriptureRefs,
      studyGuide: source.studyGuide,
      suggestedTopics: source.suggestedTopics,
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
    const source: TalkSummarySource = await ctx.runQuery(
      internal.talks.loadTalkSummarySource,
      {
        talkId,
      }
    );

    if (!source.transcript) {
      return toFailedResult('NO_TRANSCRIPT');
    }

    if (source.studyReviewed) {
      return toFailedResult('ALREADY_REVIEWED');
    }

    if (!process.env.AI_GATEWAY_API_KEY) {
      return toFailedResult('TOKEN_MISSING');
    }

    return await saveGeneratedTalkSummary(
      ctx,
      {
        ...source,
        transcript: source.transcript,
      },
      talkId
    );
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
