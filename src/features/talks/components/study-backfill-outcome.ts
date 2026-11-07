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
  'The request ended before a result arrived. Generation may still be running. Review remaining talks before generating again.';

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

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error ?? '');
}

function isExpectedStudyBackfillClientError(error: unknown) {
  if (isConvexError(error)) {
    return true;
  }

  return getErrorMessage(error).includes('ArgumentValidationError');
}

export function reportStudyBackfillClientFailure(
  error: unknown,
  selected: { talkId: string; title: string }[]
) {
  try {
    if (isExpectedStudyBackfillClientError(error)) {
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

    const errorCode = getErrorMessage(error).includes(CONVEX_CONNECTION_LOST)
      ? ErrorCodes.NETWORK_ERROR
      : ErrorCodes.UNKNOWN_ERROR;

    reportUnexpectedError(error, {
      fingerprint: [
        errorCode === ErrorCodes.NETWORK_ERROR ? 'network' : 'error',
        'backfillStudies',
        errorCode,
      ],
      level: errorCode === ErrorCodes.NETWORK_ERROR ? 'warning' : 'error',
      tags: {
        errorCode,
        operation: 'backfillStudies',
        selectedCount: String(selected.length),
      },
    });

    return {
      message: STUDY_BACKFILL_REQUEST_ENDED_MESSAGE,
      results: selected.map((talk) => ({
        status: 'unknown' as const,
        talkId: talk.talkId,
        title: talk.title,
      })),
    };
  } catch {
    return {
      message: USER_ERROR_MESSAGE,
      results: null,
    };
  }
}

export function formatStudyBackfillResults(
  results: StudyBackfillOutcome[] | null
) {
  if (!results?.length) {
    return null;
  }

  const failed: string[] = [];
  const generated: string[] = [];
  const selected: string[] = [];
  const skipped: string[] = [];

  for (const result of results) {
    const title = result.title?.trim() || 'Talk';

    if (result.status === 'failed') {
      failed.push(title);
    } else if (result.status === 'skipped') {
      skipped.push(title);
    } else if (result.status === 'unknown') {
      selected.push(title);
    } else if (result.status === 'success') {
      generated.push(title);
    }
  }

  return (
    [
      formatStudyBackfillGroup('generated', generated),
      formatStudyBackfillGroup('skipped', skipped),
      formatStudyBackfillGroup('failed', failed),
      formatStudyBackfillGroup('selected', selected),
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
