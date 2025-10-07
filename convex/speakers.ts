import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { createSpeaker, updateSpeaker } from './model/speakers/mutations';
import { getBySlug as getSpeakerBySlug } from './model/speakers/queries';
import { speakerFields } from './model/speakers/schema';

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 100 } = args;
    return await ctx.db.query('speakers').take(limit);
  },
  returns: v.array(v.object(speakerFields)),
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const { slug } = args;
    return await getSpeakerBySlug(ctx, slug);
  },
  returns: v.union(v.object(speakerFields), v.null()),
});

// TODO: Figure out how to share arg validators
export const create = mutation({
  args: {
    description: v.optional(v.string()),
    firstName: v.string(),
    imageUrl: v.optional(v.string()),
    lastName: v.string(),
    ministry: v.optional(v.string()),
    role: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await createSpeaker(ctx, args);
  },
  returns: v.id('speakers'),
});

// TODO: Figure out how to share arg validators
export const update = mutation({
  args: {
    description: v.optional(v.string()),
    firstName: v.optional(v.string()),
    id: v.id('speakers'),
    imageUrl: v.optional(v.string()),
    lastName: v.optional(v.string()),
    ministry: v.optional(v.string()),
    role: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await updateSpeaker(ctx, args);
  },
  returns: v.id('speakers'),
});
