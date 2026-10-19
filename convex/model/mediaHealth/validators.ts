import { v } from 'convex/values';

const MEDIA_CHECK_STATES = ['ignored', 'open', 'resolved'] as const;
const MEDIA_CHECK_STATUSES = ['missing', 'ok', 'private', 'unknown'] as const;

export type MediaCheckState = (typeof MEDIA_CHECK_STATES)[number];
export type MediaCheckStatus = (typeof MEDIA_CHECK_STATUSES)[number];

export const mediaCheckEntityTable = v.union(
  v.literal('clips'),
  v.literal('talks')
);

export const mediaCheckState = v.union(
  v.literal('ignored'),
  v.literal('open'),
  v.literal('resolved')
);

export const mediaCheckStatus = v.union(
  v.literal('missing'),
  v.literal('ok'),
  v.literal('private'),
  v.literal('unknown')
);

export const mediaHealthDigestItem = v.object({
  adminPath: v.string(),
  entityTable: mediaCheckEntityTable,
  firstBrokenAt: v.number(),
  mediaUrl: v.string(),
  newStatus: v.union(v.literal('missing'), v.literal('private')),
  publicPath: v.union(v.null(), v.string()),
  title: v.string(),
});

export function isMediaCheckStatus(value: unknown): value is MediaCheckStatus {
  return (
    typeof value === 'string' &&
    MEDIA_CHECK_STATUSES.includes(value as MediaCheckStatus)
  );
}
