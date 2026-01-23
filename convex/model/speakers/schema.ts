import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { timestampFields } from '../../lib/validators';
import { speakerRoleType } from './validators';

export const speakerFields = {
  ...timestampFields,
  description: v.optional(v.string()),
  featured: v.optional(v.boolean()),
  firstName: v.string(),
  imageUrl: v.optional(v.string()),
  lastName: v.string(),
  ministry: v.optional(v.string()),
  role: v.optional(speakerRoleType),
  slug: v.string(),
  websiteUrl: v.optional(v.string()),
};

export const speakerTables = {
  speakers: defineTable(speakerFields)
    .index('by_featured', ['featured'])
    .index('by_lastName', ['lastName'])
    .index('by_slug', ['slug']),
};
