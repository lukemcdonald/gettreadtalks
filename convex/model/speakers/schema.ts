import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { timestampFields } from '../../lib/validators';

export const speakerFields = {
  ...timestampFields,
  description: v.optional(v.string()),
  firstName: v.string(),
  imageUrl: v.optional(v.string()),
  lastName: v.string(),
  ministry: v.optional(v.string()),
  role: v.optional(v.string()),
  slug: v.string(),
  websiteUrl: v.optional(v.string()),
};

export const speakerTables = {
  speakers: defineTable(speakerFields)
    .index('by_last_name', ['lastName'])
    .index('by_slug', ['slug']),
};
