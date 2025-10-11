import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { statusType } from '../../lib/validators';
import { clipFields } from '../clips/schema';
import { collectionFields } from '../collections/schema';
import { speakerFields } from '../speakers/schema';
import { topicFields } from '../topics/schema';
import { talkFields } from './schema';

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

export const archiveTalkArgs = {
  id: v.id('talks'),
};
export const archiveTalkReturns = v.null();

export const getFeaturedTalksArgs = {
  limit: v.optional(v.number()),
};
export const getFeaturedTalksReturns = v.array(v.object(talkFields));

export const getRandomTalksBySpeakerArgs = {
  excludeTalkId: v.optional(v.id('talks')),
  limit: v.optional(v.number()),
  speakerId: v.id('speakers'),
};
export const getRandomTalksBySpeakerReturns = v.array(v.object(talkFields));

export const getTalkArgs = {
  id: v.id('talks'),
};
export const getTalkReturns = v.union(v.object(talkFields), v.null());

export const getTalksCountArgs = {};
export const getTalksCountReturns = v.number();

export const getTalksCountByCollectionArgs = {
  collectionId: v.id('collections'),
};
export const getTalksCountByCollectionReturns = v.number();

export const getTalksCountByTopicArgs = {
  topicId: v.id('topics'),
};
export const getTalksCountByTopicReturns = v.number();

export const getTalkBySlugArgs = {
  slug: v.string(),
};
export const getTalkBySlugReturns = v.union(
  v.object({
    clips: v.array(v.object(clipFields)),
    collection: v.union(v.object(collectionFields), v.null()),
    speaker: v.union(v.object(speakerFields), v.null()),
    talk: v.object(talkFields),
    topics: v.array(v.object(topicFields)),
  }),
  v.null(),
);

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
export const listTalksByCollectionReturns = v.array(v.object(talkFields));

export const listTalksBySpeakerArgs = {
  limit: v.optional(v.number()),
  speakerId: v.id('speakers'),
};
export const listTalksBySpeakerReturns = v.array(v.object(talkFields));

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
