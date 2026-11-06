import { estimateTalkGatewayCostUsd } from '../../talks/summary/prompt';
import { TALK_DRAFT_PENDING } from '../../talks/validators';
import { buildTalkStudyPrompt, TALK_STUDY_SYSTEM_PROMPT } from './prompt';

export const STUDY_BACKFILL_DEFAULT_LIMIT = 5;
export const STUDY_BACKFILL_MAX_LIMIT = 10;
export const STUDY_GENERATE_CHARS_PER_TOKEN = 4;
export const STUDY_GENERATE_OUTPUT_TOKENS = 4000;

export function isStudyBackfillEligible(input: {
  draftStudy?: string;
  feature: {
    manuallyEditedAt?: number;
    status: 'draft' | 'published';
  } | null;
  status: string;
  transcript: string | null | undefined;
}) {
  if (input.status !== 'published') {
    return false;
  }

  if (!input.transcript?.trim()) {
    return false;
  }

  if (input.draftStudy === TALK_DRAFT_PENDING) {
    return false;
  }

  return input.feature === null;
}

export function getStudyBackfillLimit(limit: number | undefined) {
  if (limit === undefined || !Number.isFinite(limit)) {
    return STUDY_BACKFILL_DEFAULT_LIMIT;
  }

  const requested = Math.trunc(limit);

  if (requested < 1) {
    return 1;
  }

  if (requested > STUDY_BACKFILL_MAX_LIMIT) {
    return STUDY_BACKFILL_MAX_LIMIT;
  }

  return requested;
}

export function estimateStudyInputTokens(input: {
  scripture: string;
  speaker: string;
  title: string;
  transcriptChars: number;
}) {
  const promptChars =
    buildTalkStudyPrompt({
      scripture: input.scripture,
      speaker: input.speaker,
      title: input.title,
      transcript: '',
    }).length + input.transcriptChars;

  return Math.ceil(
    (TALK_STUDY_SYSTEM_PROMPT.length + promptChars) /
      STUDY_GENERATE_CHARS_PER_TOKEN
  );
}

export function estimateStudyGenerateCost(
  talks: {
    scripture: string;
    speaker: string;
    title: string;
    transcriptChars: number;
  }[]
) {
  let estimatedInputTokens = 0;

  for (const talk of talks) {
    estimatedInputTokens += estimateStudyInputTokens(talk);
  }

  const estimatedOutputTokens = talks.length * STUDY_GENERATE_OUTPUT_TOKENS;

  return {
    estimatedCostUsd: estimateTalkGatewayCostUsd(
      estimatedInputTokens,
      estimatedOutputTokens
    ),
    estimatedInputTokens,
    estimatedOutputTokens,
  };
}

export function paginateStudyBackfillTalks<T extends { talkId: string }>({
  cursor,
  eligible,
  limit,
  orderedIds,
}: {
  cursor: string | null | undefined;
  eligible: T[];
  limit: number;
  orderedIds: string[];
}) {
  const eligibleById = new Map(eligible.map((talk) => [talk.talkId, talk]));
  const startIndex = cursor ? orderedIds.indexOf(cursor) + 1 : 0;
  const page: T[] = [];

  for (const talkId of orderedIds.slice(Math.max(startIndex, 0))) {
    const talk = eligibleById.get(talkId);

    if (!talk) {
      continue;
    }

    page.push(talk);

    if (page.length === limit) {
      break;
    }
  }

  const last = page.at(-1);
  const lastIndex = last ? orderedIds.indexOf(last.talkId) : startIndex - 1;
  const isDone = !orderedIds
    .slice(lastIndex + 1)
    .some((talkId) => eligibleById.has(talkId));

  return {
    continueCursor: last && !isDone ? last.talkId : '',
    isDone,
    page,
  };
}
