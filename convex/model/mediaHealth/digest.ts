export interface MediaHealthDigestItem {
  adminPath: string;
  entityTable: 'clips' | 'talks';
  firstBrokenAt: number;
  mediaUrl: string;
  newStatus: 'missing' | 'private';
  publicPath: string | null;
  title: string;
}

/** Matches feature clip/talk path builders without importing those modules into Convex. */
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

export function getMediaAdminEditPath(
  entityTable: 'clips' | 'talks',
  entityId: string
) {
  return `/${entityTable}/edit/${entityId}?status=archived`;
}

export function isUnnotifiedOpenCheck(check: {
  firstBrokenAt?: number;
  lastNotifiedAt?: number;
  state?: 'ignored' | 'open' | 'resolved';
  status: 'missing' | 'ok' | 'private' | 'unknown';
}) {
  if (check.state === 'ignored' || check.state === 'resolved') {
    return false;
  }

  if (check.status !== 'missing' && check.status !== 'private') {
    return false;
  }

  const firstBrokenAt = check.firstBrokenAt ?? 0;

  return (
    check.lastNotifiedAt === undefined || check.lastNotifiedAt < firstBrokenAt
  );
}
