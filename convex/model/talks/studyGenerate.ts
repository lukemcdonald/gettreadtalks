import type { Id } from '../../_generated/dataModel';
import type { ActionCtx } from '../../_generated/server';
import type { TalkSummarySource } from './summaryGenerate';
import type { z } from 'zod';

import { ConvexError, v } from 'convex/values';

import { internal } from '../../_generated/api';
import { action } from '../../_generated/server';
import {
  buildTalkStudyPrompt,
  TALK_STUDY_SYSTEM_PROMPT,
  talkStudyOutputSchema,
} from './studyPrompt';
import { loadTalkGenerateSource } from './summaryGenerate';
import { TALK_SUMMARY_MODEL } from './summaryPrompt';
import { talkStudyKeyPassage, talkStudyMainPoint } from './validators';

const STUDY_GENERATE_MESSAGES = {
  ALREADY_REVIEWED: 'This study has already been reviewed.',
  NO_TRANSCRIPT: 'A transcript is required to generate a study.',
  TOKEN_MISSING: 'Study service is not configured.',
  UPSTREAM_ERROR: 'Study service returned an error.',
} as const;

const talkStudyGenerateErrorCode = v.union(
  v.literal('ALREADY_REVIEWED'),
  v.literal('NO_TRANSCRIPT'),
  v.literal('TOKEN_MISSING'),
  v.literal('UPSTREAM_ERROR')
);

const talkStudyGenerateFailure = v.object({
  errorCode: talkStudyGenerateErrorCode,
  message: v.string(),
  status: v.literal('failed'),
});

type TalkStudyGenerateErrorCode = keyof typeof STUDY_GENERATE_MESSAGES;
type TalkStudyGenerated = z.infer<typeof talkStudyOutputSchema>;

function toFailedResult(errorCode: TalkStudyGenerateErrorCode) {
  return {
    errorCode,
    message: STUDY_GENERATE_MESSAGES[errorCode],
    status: 'failed' as const,
  };
}

function isConflictError(error: unknown) {
  return (
    error instanceof ConvexError &&
    (error.data as { statusCode?: number }).statusCode === 409
  );
}

function toTalkStudyMainPoints(points: TalkStudyGenerated['mainPoints']) {
  return points.map((point) => ({
    body: point.body.trim(),
    heading: point.heading.trim(),
    references: point.references.map((reference) => reference.trim()),
  }));
}

function toTalkStudyKeyPassages(passages: TalkStudyGenerated['keyPassages']) {
  return passages.map((passage) => ({
    note: passage.note.trim(),
    reference: passage.reference.trim(),
  }));
}

export function orderKeyPassages<T extends { reference: string }>(
  passages: T[],
  mainScripture: string
): T[] {
  const main = mainScripture.trim().toLowerCase();

  if (passages.length < 2 || !main) {
    return passages;
  }

  const mainIndex = passages.findIndex(
    (passage) => passage.reference.trim().toLowerCase() === main
  );

  if (mainIndex <= 0) {
    return passages;
  }

  const mainPassage = passages[mainIndex];

  if (!mainPassage) {
    return passages;
  }

  return [
    mainPassage,
    ...passages.slice(0, mainIndex),
    ...passages.slice(mainIndex + 1),
  ];
}

async function generateTalkStudyObject(input: {
  scripture: string;
  speaker: string;
  title: string;
  transcript: string;
}) {
  const { generateObject } = await import('ai');
  const { object } = await generateObject({
    model: TALK_SUMMARY_MODEL,
    prompt: buildTalkStudyPrompt(input),
    schema: talkStudyOutputSchema,
    system: TALK_STUDY_SYSTEM_PROMPT,
  });

  return object;
}

export const talkStudyGenerator = {
  generate: generateTalkStudyObject,
};

async function saveGeneratedTalkStudy(
  ctx: ActionCtx,
  source: TalkSummarySource & { transcript: string },
  talkId: Id<'talks'>
) {
  let generated: TalkStudyGenerated;

  try {
    generated = await talkStudyGenerator.generate({
      scripture: source.scripture,
      speaker: source.speaker,
      title: source.title,
      transcript: source.transcript,
    });
  } catch {
    return toFailedResult('UPSTREAM_ERROR');
  }

  const keyPassages = orderKeyPassages(
    toTalkStudyKeyPassages(generated.keyPassages),
    source.scripture
  );
  const mainPoints = toTalkStudyMainPoints(generated.mainPoints);

  try {
    await ctx.runMutation(internal.talks.saveTalkStudyDraft, {
      generator: TALK_SUMMARY_MODEL,
      keyPassages,
      mainPoints,
      outline: source.outline,
      scriptureRefs: source.scriptureRefs,
      studyGuide: source.studyGuide,
      suggestedTopics: source.suggestedTopics,
      summary: source.summary,
      talkId,
    });
  } catch (error) {
    if (isConflictError(error)) {
      return toFailedResult('ALREADY_REVIEWED');
    }

    return toFailedResult('UPSTREAM_ERROR');
  }

  return {
    keyPassages,
    mainPoints,
    status: 'success' as const,
  };
}

export const generateTalkStudy = action({
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
    | {
        keyPassages: ReturnType<typeof toTalkStudyKeyPassages>;
        mainPoints: ReturnType<typeof toTalkStudyMainPoints>;
        status: 'success';
      }
  > => {
    const source = await loadTalkGenerateSource(ctx, talkId);

    if ('errorCode' in source) {
      return toFailedResult(source.errorCode);
    }

    return await saveGeneratedTalkStudy(ctx, source, talkId);
  },
  returns: v.union(
    talkStudyGenerateFailure,
    v.object({
      keyPassages: v.array(talkStudyKeyPassage),
      mainPoints: v.array(talkStudyMainPoint),
      status: v.literal('success'),
    })
  ),
});
