import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { mutations, queries, speakerFields, validators } from './model/speakers';

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: validators.getSpeakerArgs,
  handler: async (ctx, args) => {
    return await queries.getSpeaker(ctx, args);
  },
  returns: v.union(v.object(speakerFields), v.null()),
});

export const getBySlug = query({
  args: validators.getSpeakerBySlugArgs,
  handler: async (ctx, args) => {
    return await queries.getSpeakerBySlug(ctx, args);
  },
  returns: v.union(v.object(speakerFields), v.null()),
});

export const list = query({
  args: validators.listSpeakersArgs,
  handler: async (ctx, args) => {
    return await queries.getSpeakers(ctx, args);
  },
  returns: v.array(v.object(speakerFields)),
});

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: validators.createSpeakerArgs,
  handler: async (ctx, args) => {
    return await mutations.createSpeaker(ctx, args);
  },
  returns: v.id('speakers'),
});

export const update = mutation({
  args: validators.updateSpeakerArgs,
  handler: async (ctx, args) => {
    return await mutations.updateSpeaker(ctx, args);
  },
  returns: v.id('speakers'),
});
