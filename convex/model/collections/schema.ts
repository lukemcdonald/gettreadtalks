import { v } from 'convex/values';
import { timestampFields } from '../../schema';
import { defineTable } from 'convex/server';

export const collectionFields = {
  ...timestampFields,
  description: v.optional(v.string()),
  slug: v.string(),
  title: v.string(),
  url: v.optional(v.string()),
};

export const collectionTables = {
  collections: defineTable(collectionFields).index('by_slug', ['slug']),
};
