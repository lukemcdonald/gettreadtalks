import { v } from 'convex/values';

const MEDIA_CHECK_STATUSES = ['missing', 'ok', 'private', 'unknown'] as const;

export type MediaCheckStatus = (typeof MEDIA_CHECK_STATUSES)[number];

export const mediaCheckEntityTable = v.union(
  v.literal('clips'),
  v.literal('talks')
);

export const mediaCheckStatus = v.union(
  v.literal('missing'),
  v.literal('ok'),
  v.literal('private'),
  v.literal('unknown')
);

export function isMediaCheckStatus(value: unknown): value is MediaCheckStatus {
  return (
    typeof value === 'string' &&
    MEDIA_CHECK_STATUSES.includes(value as MediaCheckStatus)
  );
}
