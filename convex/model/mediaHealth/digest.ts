import type { Id } from '../../_generated/dataModel';
import type { MediaCheckStatus } from './validators';

import { isBrokenStatus, isUnnotifiedBreak } from './record';

export interface MediaHealthDigestItem {
  adminPath: string;
  checkId: Id<'mediaChecks'>;
  entityTable: 'clips' | 'talks';
  isNew: boolean;
  mediaUrl: string;
  newStatus: 'missing' | 'private';
  publicPath: string | null;
  title: string;
}

export function buildMediaHealthDigest(items: MediaHealthDigestItem[]) {
  const newItems = items.filter((item) => item.isNew);

  if (newItems.length === 0) {
    return null;
  }

  return {
    items: newItems,
    stillBrokenCount: items.length - newItems.length,
  };
}

/** Matches buildClipPath / buildTalkPath without importing Next app modules into Convex. */
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
    checkId: Id<'mediaChecks'>;
    firstBrokenAt?: number;
    lastNotifiedAt?: number;
    persistStatus: MediaCheckStatus;
  },
  items: MediaHealthDigestItem[]
): MediaHealthDigestItem[] {
  if (!isBrokenStatus(outcome.persistStatus)) {
    return items;
  }

  return [
    ...items,
    {
      adminPath: `/${item.entityTable}/edit/${item.entityId}?status=archived`,
      checkId: outcome.checkId,
      entityTable: item.entityTable,
      isNew: isUnnotifiedBreak(outcome),
      mediaUrl: item.mediaUrl,
      newStatus: outcome.persistStatus,
      publicPath: getMediaPublicPath(item),
      title: item.title,
    },
  ];
}
