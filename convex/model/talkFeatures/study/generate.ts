import type { Id } from '../../../_generated/dataModel';
import type { ActionCtx } from '../../../_generated/server';
import type { TalkSummarySource } from '../../talks/summary/generate';

import { ConvexError, v } from 'convex/values';

import { api, internal } from '../../../_generated/api';
import { action } from '../../../_generated/server';
import {
  NO_TRANSCRIPT_SOURCE_MESSAGE,
  TALK_SUMMARY_MODEL,
} from '../../talks/summary/prompt';
import { loadTranscriptForGenerate } from '../../talks/transcript/fetch';
import { hasReviewedTalkFeature } from '../helpers';
import { buildTalkStudyPrompt, TALK_STUDY_SYSTEM_PROMPT } from './prompt';

const STUDY_GENERATE_MESSAGES = {
  ALREADY_REVIEWED: 'This study has already been reviewed.',
  NO_TRANSCRIPT_SOURCE: NO_TRANSCRIPT_SOURCE_MESSAGE,
  TOKEN_MISSING: 'Study service is not configured.',
  UPSTREAM_ERROR: 'Study service returned an error.',
} as const;

const talkStudyGenerateErrorCode = v.union(
  v.literal('ALREADY_REVIEWED'),
  v.literal('NO_TRANSCRIPT_SOURCE'),
  v.literal('TOKEN_MISSING'),
  v.literal('UPSTREAM_ERROR')
);

const talkStudyGenerateFailure = v.object({
  errorCode: talkStudyGenerateErrorCode,
  message: v.string(),
  status: v.literal('failed'),
});

type TalkStudyGenerateErrorCode = keyof typeof STUDY_GENERATE_MESSAGES;

function toFailedResult(
  errorCode: TalkStudyGenerateErrorCode,
  message?: string
) {
  return {
    errorCode,
    message: message ?? STUDY_GENERATE_MESSAGES[errorCode],
    status: 'failed' as const,
  };
}

function isConflictError(error: unknown) {
  return (
    error instanceof ConvexError &&
    (error.data as { statusCode?: number }).statusCode === 409
  );
}

async function generateTalkStudyMarkdown(input: {
  scripture: string;
  speaker: string;
  title: string;
  transcript: string;
}) {
  const { generateText } = await import('ai');
  const { text } = await generateText({
    model: TALK_SUMMARY_MODEL,
    prompt: buildTalkStudyPrompt(input),
    system: TALK_STUDY_SYSTEM_PROMPT,
  });

  return text.trim();
}

export const talkStudyGenerator = {
  generate: generateTalkStudyMarkdown,
};

async function saveGeneratedTalkStudy(
  ctx: ActionCtx,
  source: TalkSummarySource & { transcript: string },
  talkId: Id<'talks'>
) {
  let body: string;

  try {
    body = await talkStudyGenerator.generate({
      scripture: source.scripture,
      speaker: source.speaker,
      title: source.title,
      transcript: source.transcript,
    });
  } catch {
    return toFailedResult('UPSTREAM_ERROR');
  }

  try {
    await ctx.runMutation(internal.talkFeatures.saveTalkFeatureDraft, {
      body,
      kind: 'study',
      talkId,
    });
  } catch (error) {
    if (isConflictError(error)) {
      return toFailedResult('ALREADY_REVIEWED');
    }

    return toFailedResult('UPSTREAM_ERROR');
  }

  return {
    body,
    status: 'success' as const,
  };
}

export const generateStudy = action({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (
    ctx,
    { talkId }
  ): Promise<
    | {
        errorCode: TalkStudyGenerateErrorCode;
        message: string;
        status: 'failed';
      }
    | { body: string; status: 'success' }
  > => {
    const source: TalkSummarySource = await ctx.runQuery(
      internal.talks.loadTalkSummarySource,
      { talkId }
    );

    const feature = await ctx.runQuery(api.talkFeatures.getTalkFeature, {
      kind: 'study',
      talkId,
    });

    if (hasReviewedTalkFeature(feature)) {
      return toFailedResult('ALREADY_REVIEWED');
    }

    if (!process.env.AI_GATEWAY_API_KEY) {
      return toFailedResult('TOKEN_MISSING');
    }

    const loaded = await loadTranscriptForGenerate(
      ctx,
      talkId,
      source.transcript,
      source.mediaUrl
    );

    if ('errorCode' in loaded) {
      return toFailedResult(loaded.errorCode, loaded.message);
    }

    return await saveGeneratedTalkStudy(
      ctx,
      { ...source, transcript: loaded.transcript },
      talkId
    );
  },
  returns: v.union(
    talkStudyGenerateFailure,
    v.object({
      body: v.string(),
      status: v.literal('success'),
    })
  ),
});
