import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { doc, docs, statusType } from '../../lib/validators';

export const archiveTalkArgs = {
  id: v.id('talks'),
};
export const archiveTalkReturns = v.null();

export const createTalkArgs = {
  collectionId: v.optional(v.id('collections')),
  collectionOrder: v.optional(v.number()),
  mediaUrl: v.string(),
  scripture: v.optional(v.string()),
  speakerId: v.id('speakers'),
  status: v.optional(statusType),
  title: v.string(),
};
export const createTalkReturns = v.id('talks');

export const getCountArgs = {};
export const getCountReturns = v.number();

export const listRandomTalksBySpeakerArgs = {
  excludeTalkId: v.optional(v.id('talks')),
  limit: v.optional(v.number()),
  speakerId: v.id('speakers'),
};
export const listRandomTalksBySpeakerReturns = docs('talks');

export const getTalkArgs = {
  id: v.id('talks'),
};
export const getTalkReturns = doc('talks', true);

export const getTalkBySlugArgs = {
  slug: v.string(),
};
export const getTalkBySlugReturns = v.union(
  v.object({
    clips: docs('clips'),
    collection: doc('collections', true),
    speaker: doc('speakers', true),
    talk: doc('talks'),
    topics: docs('topics'),
  }),
  v.null(),
);

export const listFeaturedTalksArgs = {
  limit: v.optional(v.number()),
};
export const listFeaturedTalksReturns = docs('talks');

export const listTalksArgs = {
  paginationOpts: paginationOptsValidator,
  status: v.optional(statusType),
};

/**
 * Pagination return type uses v.any() per Convex standard pattern.
 * See: https://docs.convex.dev/database/pagination
 *
 * Returns: PaginationResult<Doc<'talks'>>
 * Structure: { page: Doc<'talks'>[], continueCursor: string, isDone: boolean }
 */
export const listTalksReturns = v.any();

export const listTalksByCollectionArgs = {
  collectionId: v.id('collections'),
  limit: v.optional(v.number()),
};
export const listTalksByCollectionReturns = docs('talks');

export const listTalksBySpeakerArgs = {
  limit: v.optional(v.number()),
  speakerId: v.id('speakers'),
};
export const listTalksBySpeakerReturns = docs('talks');

export const listTalksWithSpeakersArgs = {
  paginationOpts: paginationOptsValidator,
  status: v.optional(statusType),
};

/**
 * Pagination return type uses v.any() per Convex standard pattern.
 * See: https://docs.convex.dev/database/pagination
 *
 * Returns: PaginationResult with enriched page
 * Structure: { page: Array<Doc<'talks'> & { speaker: Doc<'speakers'> | null }>, continueCursor: string, isDone: boolean }
 */
export const listTalksWithSpeakersReturns = v.any();

export const updateTalkArgs = {
  collectionId: v.optional(v.id('collections')),
  collectionOrder: v.optional(v.number()),
  description: v.optional(v.string()),
  featured: v.optional(v.boolean()),
  id: v.id('talks'),
  mediaUrl: v.optional(v.string()),
  scripture: v.optional(v.string()),
  speakerId: v.optional(v.id('speakers')),
  status: v.optional(statusType),
  title: v.optional(v.string()),
};
export const updateTalkReturns = v.id('talks');

export const updateTalkStatusArgs = {
  id: v.id('talks'),
  status: statusType,
};
export const updateTalkStatusReturns = v.id('talks');
