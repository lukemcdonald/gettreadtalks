import type { MediaCheckState, MediaCheckStatus } from './validators';

const STRONG_STATUSES = new Set<MediaCheckStatus>(['missing', 'ok', 'private']);

export interface MediaCheckSnapshot {
  firstBrokenAt?: number;
  lastNotifiedAt?: number;
  state?: MediaCheckState;
  status: MediaCheckStatus;
}

export function decideMediaCheck(args: {
  checkedAt: number;
  existing: MediaCheckSnapshot | null;
  observedStatus: MediaCheckStatus;
}): {
  firstBrokenAt?: number;
  lastNotifiedAt?: number;
  persistStatus: MediaCheckStatus;
  state: MediaCheckState;
} {
  const persistStatus = persistStatusFor(args);
  const existingState = args.existing?.state;

  if (existingState === 'ignored') {
    return {
      firstBrokenAt: args.existing?.firstBrokenAt,
      lastNotifiedAt: args.existing?.lastNotifiedAt,
      persistStatus,
      state: 'ignored',
    };
  }

  if (!isBrokenStatus(persistStatus)) {
    return {
      persistStatus,
      state: 'resolved',
    };
  }

  if (existingState === 'open') {
    return {
      firstBrokenAt: args.existing?.firstBrokenAt ?? args.checkedAt,
      lastNotifiedAt: args.existing?.lastNotifiedAt,
      persistStatus,
      state: 'open',
    };
  }

  return {
    firstBrokenAt: args.checkedAt,
    persistStatus,
    state: 'open',
  };
}

export function isBrokenStatus(
  status: MediaCheckStatus
): status is 'missing' | 'private' {
  return status === 'missing' || status === 'private';
}

function persistStatusFor(args: {
  existing: MediaCheckSnapshot | null;
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
