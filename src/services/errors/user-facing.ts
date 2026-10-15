import type { ErrorReportOptions } from './types';

import { IS_DEV } from '@/constants/env';

import { captureException } from './client';

export const USER_ERROR_MESSAGE = 'Something went wrong. Please try again.';

const DEVELOPER_DETAIL =
  /(?:\n\s+at\s+|environment variable|is not set|not configured|NEXT_PUBLIC_[A-Z0-9_]+|[A-Z][A-Z0-9_]*_(?:DSN|KEY|SECRET|TOKEN|URL)\b|process\.env)/u;

const reported = new Set<string>();

export function looksLikeDeveloperError(message: string): boolean {
  return DEVELOPER_DETAIL.test(message);
}

/** Report an unexpected error once, log it in development, and return a safe user message. */
export function reportUnexpectedError(
  error: unknown,
  options: ErrorReportOptions = {}
): string {
  const detail = rawErrorDetail(error);
  const key = options.fingerprint?.join(':') ?? detail;

  if (!reported.has(key)) {
    reported.add(key);

    if (IS_DEV) {
      console.error(error);
    }

    captureException(error instanceof Error ? error : new Error(detail), {
      context: options.context,
      fingerprint: options.fingerprint ?? ['error', 'unexpected'],
      level: options.level ?? 'error',
      tags: options.tags,
    });
  }

  return USER_ERROR_MESSAGE;
}

export function toUserErrorMessage(
  message: string | undefined,
  fallback = USER_ERROR_MESSAGE
): string {
  if (!message) {
    return fallback;
  }

  if (!looksLikeDeveloperError(message)) {
    return message;
  }

  reportUnexpectedError(message);

  return fallback;
}

function rawErrorDetail(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return String(error);
}
