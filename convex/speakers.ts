import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { createSpeaker, updateSpeaker } from './model/speakers/mutations';
import { getSpeaker, getSpeakerBySlug, getSpeakers } from './model/speakers/queries';
import { speakerFields } from './model/speakers/schema';
import { createSpeakerArgs, updateSpeakerArgs } from './model/speakers/validators';

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: {
    id: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    return await getSpeaker(ctx, args.id);
  },
  returns: v.union(v.object(speakerFields), v.null()),
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await getSpeakerBySlug(ctx, args.slug);
  },
  returns: v.union(v.object(speakerFields), v.null()),
});

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 100 } = args;
    return await getSpeakers(ctx, limit);
  },
  returns: v.array(v.object(speakerFields)),
});

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: createSpeakerArgs,
  handler: async (ctx, args) => {
    return await createSpeaker(ctx, args);
  },
  returns: v.id('speakers'),
});

export const update = mutation({
  args: updateSpeakerArgs,
  handler: async (ctx, args) => {
    return await updateSpeaker(ctx, args);
  },
  returns: v.id('speakers'),
});
