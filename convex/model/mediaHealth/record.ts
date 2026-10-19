import type { MediaCheckStatus } from './validators';

const STRONG_STATUSES = new Set<MediaCheckStatus>(['missing', 'ok', 'private']);

export function decideMediaCheck(args: {
  checkedAt: number;
  existing: {
    firstBrokenAt?: number;
    lastNotifiedAt?: number;
    status: MediaCheckStatus;
  } | null;
  observedStatus: MediaCheckStatus;
}): {
  firstBrokenAt?: number;
  lastNotifiedAt?: number;
  persistStatus: MediaCheckStatus;
} {
  const persistStatus = persistStatusFor(args);

  if (!isBrokenStatus(persistStatus)) {
    return { persistStatus };
  }

  return {
    firstBrokenAt: args.existing?.firstBrokenAt ?? args.checkedAt,
    lastNotifiedAt: args.existing?.lastNotifiedAt,
    persistStatus,
  };
}

export function isBrokenStatus(
  status: MediaCheckStatus
): status is 'missing' | 'private' {
  return status === 'missing' || status === 'private';
}

export function isUnnotifiedBreak(check: {
  firstBrokenAt?: number;
  lastNotifiedAt?: number;
  persistStatus: MediaCheckStatus;
}) {
  if (!isBrokenStatus(check.persistStatus)) {
    return false;
  }

  const firstBrokenAt = check.firstBrokenAt ?? 0;

  return (
    check.lastNotifiedAt === undefined || check.lastNotifiedAt < firstBrokenAt
  );
}

function persistStatusFor(args: {
  existing: { status: MediaCheckStatus } | null;
  observedStatus: MediaCheckStatus;
}): MediaCheckStatus {
  const existingStatus = args.existing?.status ?? null;
  const { observedStatus } = args;

  if (existingStatus === null) {
    return observedStatus;
  }

  if (observedStatus === 'unknown' && STRONG_STATUSES.has(existingStatus)) {
    return existingStatus;
  }

  return observedStatus;
}
