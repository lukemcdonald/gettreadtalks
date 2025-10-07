import { v } from 'convex/values';
import { timestampFields } from '../../lib/validators';
import { defineTable } from 'convex/server';

export const topicFields = {
  ...timestampFields,
  slug: v.string(),
  title: v.string(),
};

export const topicTables = {
  topics: defineTable(topicFields).index('by_slug', ['slug']).index('by_title', ['title']),
};
