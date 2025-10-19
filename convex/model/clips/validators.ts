import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { statusType } from '../../lib/validators';
import { doc, docs } from '../../lib/validators/schema';

export const createClipArgs = {
  description: v.optional(v.string()),
  mediaUrl: v.string(),
  speakerId: v.optional(v.id('speakers')),
  status: v.optional(statusType),
  talkId: v.optional(v.id('talks')),
  title: v.string(),
};

export const createClipReturns = v.id('clips');

export const archiveClipArgs = {
  id: v.id('clips'),
};

export const archiveClipReturns = v.null();

export const getClipBySlugWithRelationsArgs = {
  slug: v.string(),
};

export const getClipBySlugWithRelationsReturns = v.union(
  v.object({
    clip: doc('clips'), // Guaranteed to exist (default: false)
    speaker: doc('speakers', true),
    talk: doc('talks', true),
    topics: docs('topics'),
  }),
  v.null(),
);

export const listBySpeakerArgs = {
  limit: v.optional(v.number()),
  speakerId: v.id('speakers'),
};

export const listBySpeakerReturns = docs('clips');

export const listClipsArgs = {
  paginationOpts: paginationOptsValidator,
  status: v.optional(statusType),
};

/**
 * Pagination return type uses v.any() per Convex standard pattern.
 * See: https://docs.convex.dev/database/pagination
 *
 * Returns: PaginationResult<Doc<'clips'>>
 * Structure: { page: Doc<'clips'>[], continueCursor: string, isDone: boolean }
 */
export const listClipsReturns = v.any();

export const updateClipArgs = {
  description: v.optional(v.string()),
  id: v.id('clips'),
  mediaUrl: v.optional(v.string()),
  speakerId: v.optional(v.id('speakers')),
  status: v.optional(statusType),
  talkId: v.optional(v.id('talks')),
  title: v.optional(v.string()),
};

export const updateClipReturns = v.id('clips');

export const updateClipStatusArgs = {
  id: v.id('clips'),
  status: v.union(
    v.literal('approved'),
    v.literal('archived'),
    v.literal('backlog'),
    v.literal('published'),
  ),
};

export const updateClipStatusReturns = v.id('clips');
