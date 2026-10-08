import type { MediaCheckStatus } from './validators';

export interface MediaHealthDigestItem {
  adminPath: string;
  entityTable: 'clips' | 'talks';
  isNew: boolean;
  mediaUrl: string;
  newStatus: 'missing' | 'private';
  previousStatus: MediaCheckStatus;
  publicPath: string | null;
  title: string;
}

export function buildMediaHealthDigest(
  items: MediaHealthDigestItem[]
): MediaHealthDigestItem[] | null {
  if (items.length === 0) {
    return null;
  }

  return items;
}

/** Matches getClipUrl / getTalkUrl without importing Next app modules into Convex. */
export function getMediaPublicPath(item: {
  entityTable: 'clips' | 'talks';
  slug: string;
  speakerSlug?: string;
}): string | null {
  if (item.entityTable === 'clips') {
    return `/clips/${item.slug}`;
  }

  if (!item.speakerSlug) {
    return null;
  }

  return `/talks/${item.speakerSlug}/${item.slug}`;
}

export function appendMediaHealthItem(
  item: {
    entityId: string;
    entityTable: 'clips' | 'talks';
    mediaUrl: string;
    slug: string;
    speakerSlug?: string;
    title: string;
  },
  outcome: {
    persistStatus: MediaCheckStatus;
    previousStatus: MediaCheckStatus | null;
  },
  items: MediaHealthDigestItem[]
): MediaHealthDigestItem[] {
  if (!isBrokenPersistStatus(outcome.persistStatus)) {
    return items;
  }

  return [
    ...items,
    {
      adminPath: getMediaAdminEditPath(item.entityTable, item.entityId),
      entityTable: item.entityTable,
      isNew: isNewBrokenItem(outcome.previousStatus),
      mediaUrl: item.mediaUrl,
      newStatus: outcome.persistStatus,
      previousStatus: outcome.previousStatus ?? 'unknown',
      publicPath: getMediaPublicPath(item),
      title: item.title,
    },
  ];
}

function getMediaAdminEditPath(
  entityTable: 'clips' | 'talks',
  entityId: string
) {
  return `/${entityTable}/edit/${entityId}?status=archived`;
}

function isBrokenPersistStatus(
  status: MediaCheckStatus
): status is 'missing' | 'private' {
  return status === 'missing' || status === 'private';
}

function isNewBrokenItem(previousStatus: MediaCheckStatus | null) {
  return previousStatus !== 'missing' && previousStatus !== 'private';
}
