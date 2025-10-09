import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { mutations, queries, talkFields, validators } from './model/talks';
import { speakerFields } from './model/speakers/schema';

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: validators.getTalkArgs,
  handler: async (ctx, args) => {
    return await queries.getTalk(ctx, args);
  },
  returns: v.union(v.object(talkFields), v.null()),
});

export const getByCollection = query({
  args: validators.getTalksByCollectionArgs,
  handler: async (ctx, args) => {
    return await queries.getTalksByCollection(ctx, args);
  },
  returns: v.array(v.object(talkFields)),
});

export const getBySlug = query({
  args: validators.getTalkBySlugArgs,
  handler: async (ctx, args) => {
    return await queries.getTalkBySlugWithRelations(ctx, args);
  },
  returns: v.union(
    v.object({
      collection: v.union(v.any(), v.null()),
      speaker: v.union(v.any(), v.null()),
      talk: v.any(),
    }),
    v.null(),
  ),
});

export const getBySpeaker = query({
  args: validators.getTalksBySpeakerArgs,
  handler: async (ctx, args) => {
    return await queries.getTalksBySpeaker(ctx, args);
  },
  returns: v.array(v.object(talkFields)),
});

export const list = query({
  args: validators.listTalksArgs,
  handler: async (ctx, args) => {
    return await queries.getTalksWithSpeakers(ctx, args);
  },
  returns: v.array(
    v.object({
      ...talkFields,
      speaker: v.union(v.object(speakerFields), v.null()),
    }),
  ),
});

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: validators.createTalkArgs,
  handler: async (ctx, args) => {
    return await mutations.createTalk(ctx, args);
  },
  returns: v.id('talks'),
});

export const updateStatus = mutation({
  args: validators.updateTalkStatusArgs,
  handler: async (ctx, args) => {
    return await mutations.updateTalkStatus(ctx, args);
  },
  returns: v.id('talks'),
});
