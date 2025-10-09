import { v } from 'convex/values';

export const createCollectionArgs = {
  description: v.optional(v.string()),
  title: v.string(),
  url: v.optional(v.string()),
};

export const getCollectionArgs = {
  id: v.id('collections'),
};

export const getCollectionBySlugArgs = {
  slug: v.string(),
};

export const getCollectionWithTalksArgs = {
  limit: v.optional(v.number()),
  slug: v.string(),
};

export const listCollectionsArgs = {
  limit: v.optional(v.number()),
};

export const updateCollectionArgs = {
  description: v.optional(v.string()),
  id: v.id('collections'),
  title: v.optional(v.string()),
  url: v.optional(v.string()),
};
