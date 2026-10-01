import type { MediaCheckStatus } from './validators';

const STRONG_STATUSES = new Set<MediaCheckStatus>(['missing', 'ok', 'private']);

export function decideMediaCheck(args: {
  existingStatus: MediaCheckStatus | null;
  observedStatus: MediaCheckStatus;
}): {
  isTransition: boolean;
  persistStatus: MediaCheckStatus;
} {
  const persistStatus = persistStatusFor(args);

  return {
    isTransition: isBrokenTransition(args.existingStatus, persistStatus),
    persistStatus,
  };
}

function isBrokenStatus(
  status: MediaCheckStatus
): status is 'missing' | 'private' {
  return status === 'missing' || status === 'private';
}

function isBrokenTransition(
  existingStatus: MediaCheckStatus | null,
  persistStatus: MediaCheckStatus
) {
  if (existingStatus === null) {
    return false;
  }

  return isBrokenStatus(persistStatus) && persistStatus !== existingStatus;
}

function persistStatusFor(args: {
  existingStatus: MediaCheckStatus | null;
  observedStatus: MediaCheckStatus;
}): MediaCheckStatus {
  const { existingStatus, observedStatus } = args;

  if (existingStatus === null) {
    return observedStatus;
  }

  if (observedStatus === 'unknown' && STRONG_STATUSES.has(existingStatus)) {
    return existingStatus;
  }

  return observedStatus;
}
