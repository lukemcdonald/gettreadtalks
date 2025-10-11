import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { speakerFields } from '../speakers/schema';
import { talkFields } from '../talks/schema';
import { collectionFields } from './schema';

export const createCollectionArgs = {
  description: v.optional(v.string()),
  title: v.string(),
  url: v.optional(v.string()),
};

export const createCollectionReturns = v.id('collections');

export const destroyCollectionArgs = {
  id: v.id('collections'),
};

export const destroyCollectionReturns = v.null();

export const getCollectionArgs = {
  id: v.id('collections'),
};

export const getCollectionReturns = v.union(v.object(collectionFields), v.null());

export const getCollectionBySlugArgs = {
  slug: v.string(),
};

export const getCollectionBySlugReturns = v.union(v.object(collectionFields), v.null());

export const listBySpeakerArgs = {
  speakerId: v.id('speakers'),
};

export const listBySpeakerReturns = v.array(v.object(collectionFields));

export const listWithStatsArgs = {
  paginationOpts: paginationOptsValidator,
};

/**
 * Pagination return type uses v.any() per Convex standard pattern.
 * See: https://docs.convex.dev/database/pagination
 *
 * Returns: PaginationResult with enriched page
 * Structure: { page: Array<Doc<'collections'> & stats>, continueCursor: string, isDone: boolean }
 */
export const listWithStatsReturns = v.any();

export const getCollectionWithSpeakersArgs = {
  slug: v.string(),
};

export const getCollectionWithSpeakersReturns = v.union(
  v.object({
    collection: v.object(collectionFields),
    speakers: v.array(v.object(speakerFields)),
  }),
  v.null(),
);

export const getCollectionWithTalksArgs = {
  limit: v.optional(v.number()),
  slug: v.string(),
};

export const getCollectionWithTalksReturns = v.union(
  v.object({
    collection: v.object(collectionFields),
    talks: v.array(v.object(talkFields)),
  }),
  v.null(),
);

export const listCollectionsArgs = {
  paginationOpts: paginationOptsValidator,
};

/**
 * Pagination return type uses v.any() per Convex standard pattern.
 * See: https://docs.convex.dev/database/pagination
 *
 * Returns: PaginationResult<Doc<'collections'>>
 * Structure: { page: Doc<'collections'>[], continueCursor: string, isDone: boolean }
 */
export const listCollectionsReturns = v.any();

export const updateCollectionArgs = {
  description: v.optional(v.string()),
  id: v.id('collections'),
  title: v.optional(v.string()),
  url: v.optional(v.string()),
};

export const updateCollectionReturns = v.id('collections');
