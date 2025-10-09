import { v } from 'convex/values';

export const createCollectionArgs = {
  description: v.optional(v.string()),
  title: v.string(),
  url: v.optional(v.string()),
};

export const updateCollectionArgs = {
  description: v.optional(v.string()),
  id: v.id('collections'),
  title: v.optional(v.string()),
  url: v.optional(v.string()),
};
