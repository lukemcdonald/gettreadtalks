import { NO_TRANSCRIPT_SOURCE_MESSAGE } from '@/convex/model/talks/summary/prompt';
import {
  captureException,
  formatErrorMessage,
  reportUnexpectedError,
} from '@/services/errors';
import { ErrorCodes } from '@/services/errors/constants';
import { getSentryConfig, isConvexError } from '@/services/errors/convex';
import { USER_ERROR_MESSAGE } from '@/services/errors/user-facing';

export const STUDY_BACKFILL_REQUEST_ENDED_MESSAGE =
  'The request ended before a result arrived. Generation may still be running. Wait until the remaining count stops changing before generating again.';

const CONVEX_CONNECTION_LOST = 'Connection lost while action was in flight';

export interface StudyBackfillOutcome {
  errorCode?: string;
  status: 'failed' | 'skipped' | 'success' | 'unknown';
  talkId: string;
  title?: string;
}

export function getStudyBackfillErrorMessage(code?: string) {
  if (code === 'TOKEN_MISSING') {
    return 'Study service is not configured.';
  }

  if (code === 'UPSTREAM_ERROR') {
    return 'Study service returned an error.';
  }

  if (code === 'NO_TRANSCRIPT_SOURCE') {
    return NO_TRANSCRIPT_SOURCE_MESSAGE;
  }

  if (code === ErrorCodes.NETWORK_ERROR) {
    return STUDY_BACKFILL_REQUEST_ENDED_MESSAGE;
  }

  return USER_ERROR_MESSAGE;
}

export function getStudyBackfillRequestFailure(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? '');

  if (message.includes(CONVEX_CONNECTION_LOST)) {
    return {
      errorCode: ErrorCodes.NETWORK_ERROR,
      message: STUDY_BACKFILL_REQUEST_ENDED_MESSAGE,
    };
  }

  return {
    errorCode: ErrorCodes.UNKNOWN_ERROR,
    message: STUDY_BACKFILL_REQUEST_ENDED_MESSAGE,
  };
}

export function reportStudyBackfillClientFailure(
  error: unknown,
  attempted: { talkId: string; title: string }[]
) {
  if (isConvexError(error)) {
    const sentryConfig = getSentryConfig(error);

    if (sentryConfig.shouldLog) {
      captureException(error, {
        context: sentryConfig.context,
        fingerprint: sentryConfig.fingerprint,
        level: sentryConfig.level,
        tags: {
          ...sentryConfig.tags,
          operation: 'backfillStudies',
        },
      });
    }

    return {
      message: formatErrorMessage(error),
      results: null,
    };
  }

  const failure = getStudyBackfillRequestFailure(error);

  reportUnexpectedError(error, {
    fingerprint: [
      failure.errorCode === ErrorCodes.NETWORK_ERROR ? 'network' : 'error',
      'backfillStudies',
      failure.errorCode,
    ],
    level: failure.errorCode === ErrorCodes.NETWORK_ERROR ? 'warning' : 'error',
    tags: {
      attemptedCount: String(attempted.length),
      errorCode: failure.errorCode,
      operation: 'backfillStudies',
    },
  });

  return {
    message: failure.message,
    results: toStudyBackfillUnknownResults(attempted),
  };
}

export async function runStudyBackfillRequest({
  attempted,
  backfill,
  cursor,
  limit,
}: {
  attempted: { talkId: string; title: string }[];
  backfill: (args: { cursor?: string; limit: number }) => Promise<{
    continueCursor: string;
    results: StudyBackfillOutcome[];
  }>;
  cursor: string;
  limit: number;
}) {
  try {
    const result = await backfill({
      cursor: cursor || undefined,
      limit,
    });
    const failed = result.results.find((item) => item.status === 'failed');

    return {
      continueCursor: result.continueCursor,
      error: failed ? getStudyBackfillErrorMessage(failed.errorCode) : null,
      results: result.results,
    };
  } catch (error) {
    const failure = reportStudyBackfillClientFailure(error, attempted);

    return {
      error: failure.message,
      results: failure.results,
    };
  }
}

export function toStudyBackfillUnknownResults(
  talks: { talkId: string; title: string }[]
): StudyBackfillOutcome[] {
  return talks.map((talk) => ({
    status: 'unknown' as const,
    talkId: talk.talkId,
    title: talk.title,
  }));
}

export function formatStudyBackfillResults(
  results: StudyBackfillOutcome[] | null
) {
  if (!results?.length) {
    return null;
  }

  const failed: string[] = [];
  const generated: string[] = [];
  const skipped: string[] = [];
  const unknown: string[] = [];

  for (const result of results) {
    const title = result.title?.trim() || 'Talk';

    if (result.status === 'failed') {
      failed.push(title);
    } else if (result.status === 'skipped') {
      skipped.push(title);
    } else if (result.status === 'unknown') {
      unknown.push(title);
    } else if (result.status === 'success') {
      generated.push(title);
    }
  }

  return (
    [
      formatStudyBackfillGroup('generated', generated),
      formatStudyBackfillGroup('skipped', skipped),
      formatStudyBackfillGroup('failed', failed),
      formatStudyBackfillGroup('unknown', unknown),
    ]
      .filter(Boolean)
      .join('. ') || null
  );
}

function formatStudyBackfillGroup(label: string, titles: string[]) {
  if (titles.length === 0) {
    return null;
  }

  return `${titles.length} ${label}: ${titles.join(', ')}`;
}
