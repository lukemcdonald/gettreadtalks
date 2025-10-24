import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { statusType } from './lib/validators';
import { doc, docs } from './lib/validators/schema';
import { mutations, queries } from './model/clips';

// ============================================
// QUERIES
// ============================================

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await queries.getClipBySlugWithRelations(ctx, args);
  },
  returns: v.union(
    v.object({
      clip: doc('clips'),
      speaker: doc('speakers', true),
      talk: doc('talks', true),
      topics: docs('topics'),
    }),
    v.null(),
  ),
});

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(statusType),
  },
  handler: async (ctx, args) => {
    return await queries.getClips(ctx, args);
  },
  returns: v.any(), // PaginationResult<Doc<'clips'>>
});

export const listBySpeaker = query({
  args: {
    limit: v.optional(v.number()),
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    return await queries.getClipsBySpeaker(ctx, args);
  },
  returns: docs('clips'),
});

// ============================================
// MUTATIONS
// ============================================

export const archive = mutation({
  args: {
    id: v.id('clips'),
  },
  handler: async (ctx, args) => {
    return await mutations.archiveClip(ctx, args);
  },
  returns: v.null(),
});

export const create = mutation({
  args: {
    description: v.optional(v.string()),
    mediaUrl: v.string(),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(statusType),
    talkId: v.optional(v.id('talks')),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    return await mutations.createClip(ctx, args);
  },
  returns: v.id('clips'),
});

export const update = mutation({
  args: {
    description: v.optional(v.string()),
    id: v.id('clips'),
    mediaUrl: v.optional(v.string()),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(statusType),
    talkId: v.optional(v.id('talks')),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await mutations.updateClip(ctx, args);
  },
  returns: v.id('clips'),
});

export const updateStatus = mutation({
  args: {
    id: v.id('clips'),
    status: statusType,
  },
  handler: async (ctx, args) => {
    return await mutations.updateClipStatus(ctx, args);
  },
  returns: v.id('clips'),
});
