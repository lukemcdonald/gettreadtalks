import type { StatusType } from './types';

const UTC_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/u;

/**
 * Calendar date (YYYY-MM-DD) for a timestamp in UTC.
 */
export function formatUtcDate(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

/**
 * True when `isoDate` is after today's UTC calendar date.
 */
export function isFutureUtcDate(isoDate: string, now = Date.now()): boolean {
  return isoDate > formatUtcDate(now);
}

export function isFuturePublishedAt(
  timestamp: number,
  now = Date.now()
): boolean {
  return isFutureUtcDate(formatUtcDate(timestamp), now);
}

/**
 * Parse a UTC calendar date to midnight UTC. Rejects overflow dates like 2024-02-30.
 */
export function parseUtcDate(isoDate: string): number | undefined {
  if (!UTC_DATE_PATTERN.test(isoDate)) {
    return;
  }

  const timestamp = Date.parse(`${isoDate}T00:00:00.000Z`);

  if (Number.isNaN(timestamp) || formatUtcDate(timestamp) !== isoDate) {
    return;
  }

  return timestamp;
}

/**
 * Resolve the stored publishedAt for a status change.
 * Empty requested dates keep the existing timestamp, or now when first publishing.
 */
export function getPublishedAt({
  currentPublishedAt,
  now = Date.now(),
  requestedPublishedAt,
  status,
}: {
  currentPublishedAt?: number;
  now?: number;
  requestedPublishedAt?: number;
  status: StatusType;
}): number | undefined {
  if (status !== 'published') {
    return;
  }

  if (requestedPublishedAt === undefined) {
    return currentPublishedAt ?? now;
  }

  if (
    currentPublishedAt !== undefined &&
    formatUtcDate(requestedPublishedAt) === formatUtcDate(currentPublishedAt)
  ) {
    return currentPublishedAt;
  }

  return requestedPublishedAt;
}
