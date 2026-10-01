import type { MediaCheckStatus } from './validators';

export interface MediaHealthTransition {
  adminPath: string;
  entityTable: 'clips' | 'talks';
  mediaUrl: string;
  newStatus: 'missing' | 'private';
  previousStatus: MediaCheckStatus;
  title: string;
}

export function buildMediaHealthDigest(
  items: MediaHealthTransition[]
): MediaHealthTransition[] | null {
  if (items.length === 0) {
    return null;
  }

  return items;
}

export function getMediaAdminPath(
  entityTable: 'clips' | 'talks',
  entityId: string
): string {
  if (entityTable === 'clips') {
    return `/clips/edit/${entityId}`;
  }

  return `/talks/edit/${entityId}`;
}

export function appendMediaHealthTransition(
  item: {
    entityId: string;
    entityTable: 'clips' | 'talks';
    mediaUrl: string;
    title: string;
  },
  outcome: {
    isTransition: boolean;
    persistStatus: MediaCheckStatus;
    previousStatus: MediaCheckStatus | null;
  },
  transitions: MediaHealthTransition[]
): MediaHealthTransition[] {
  if (!outcome.isTransition || !isBrokenPersistStatus(outcome.persistStatus)) {
    return transitions;
  }

  return [
    ...transitions,
    {
      adminPath: getMediaAdminPath(item.entityTable, item.entityId),
      entityTable: item.entityTable,
      mediaUrl: item.mediaUrl,
      newStatus: outcome.persistStatus,
      previousStatus: outcome.previousStatus ?? 'unknown',
      title: item.title,
    },
  ];
}

function isBrokenPersistStatus(
  status: MediaCheckStatus
): status is 'missing' | 'private' {
  return status === 'missing' || status === 'private';
}
