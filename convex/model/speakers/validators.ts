import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { doc, docs } from '../../lib/validators';

export const createSpeakerArgs = {
  description: v.optional(v.string()),
  firstName: v.string(),
  imageUrl: v.optional(v.string()),
  lastName: v.string(),
  ministry: v.optional(v.string()),
  role: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
};

export const createSpeakerReturns = v.id('speakers');

export const destroySpeakerArgs = {
  id: v.id('speakers'),
};

export const destroySpeakerReturns = v.null();

export const getCountArgs = {};

export const getCountReturns = v.number();

export const getSpeakerArgs = {
  id: v.id('speakers'),
};

export const getSpeakerBySlugArgs = {
  slug: v.string(),
};

export const getSpeakerBySlugReturns = doc('speakers', true);

export const getSpeakerReturns = doc('speakers', true);

export const listFeaturedSpeakersArgs = {
  limit: v.optional(v.number()),
};

export const listFeaturedSpeakersReturns = docs('speakers');

export const listSpeakersArgs = {
  paginationOpts: paginationOptsValidator,
};

/**
 * Pagination return type uses v.any() per Convex standard pattern.
 * See: https://docs.convex.dev/database/pagination
 *
 * Returns: PaginationResult<Doc<'speakers'>>
 * Structure: { page: Doc<'speakers'>[], continueCursor: string, isDone: boolean }
 */
export const listSpeakersReturns = v.any();

export const updateSpeakerArgs = {
  description: v.optional(v.string()),
  firstName: v.optional(v.string()),
  id: v.id('speakers'),
  imageUrl: v.optional(v.string()),
  lastName: v.optional(v.string()),
  ministry: v.optional(v.string()),
  role: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
};

export const updateSpeakerReturns = v.id('speakers');
