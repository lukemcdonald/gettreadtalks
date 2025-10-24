import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { statusType } from './lib/validators';
import { doc, docs } from './lib/validators/schema';
import { mutations, queries } from './model/talks';

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: {
    id: v.id('talks'),
  },
  handler: async (ctx, args) => {
    return await queries.getTalk(ctx, args);
  },
  returns: doc('talks', true),
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await queries.getTalkBySlugWithRelations(ctx, args);
  },
  returns: v.union(
    v.object({
      clips: docs('clips'),
      collection: doc('collections', true),
      speaker: doc('speakers', true),
      talk: doc('talks'),
      topics: docs('topics'),
    }),
    v.null(),
  ),
});

export const getCount = query({
  args: {},
  handler: async (ctx) => {
    return await queries.getTalksCount(ctx);
  },
  returns: v.number(),
});

export const listRandomBySpeaker = query({
  args: {
    excludeTalkId: v.optional(v.id('talks')),
    limit: v.optional(v.number()),
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    return await queries.getRandomTalksBySpeaker(ctx, args);
  },
  returns: docs('talks'),
});

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(statusType),
  },
  handler: async (ctx, args) => {
    return await queries.getTalks(ctx, args);
  },
  returns: v.any(), // PaginationResult<Doc<'talks'>>
});

export const listByCollection = query({
  args: {
    collectionId: v.id('collections'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await queries.getTalksByCollection(ctx, args);
  },
  returns: docs('talks'),
});

export const listBySpeaker = query({
  args: {
    limit: v.optional(v.number()),
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    return await queries.getTalksBySpeaker(ctx, args);
  },
  returns: docs('talks'),
});

export const listFeatured = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await queries.listFeaturedTalks(ctx, args);
  },
  returns: docs('talks'),
});

export const listWithSpeakers = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(statusType),
  },
  handler: async (ctx, args) => {
    return await queries.getTalksWithSpeakers(ctx, args);
  },
  returns: v.any(), // PaginationResult with enriched page
});

// ============================================
// MUTATIONS
// ============================================

export const archive = mutation({
  args: {
    id: v.id('talks'),
  },
  handler: async (ctx, args) => {
    return await mutations.archiveTalk(ctx, args);
  },
  returns: v.null(),
});

export const create = mutation({
  args: {
    collectionId: v.optional(v.id('collections')),
    collectionOrder: v.optional(v.number()),
    mediaUrl: v.string(),
    scripture: v.optional(v.string()),
    speakerId: v.id('speakers'),
    status: v.optional(statusType),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    return await mutations.createTalk(ctx, args);
  },
  returns: v.id('talks'),
});

export const update = mutation({
  args: {
    collectionId: v.optional(v.id('collections')),
    collectionOrder: v.optional(v.number()),
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    id: v.id('talks'),
    mediaUrl: v.optional(v.string()),
    scripture: v.optional(v.string()),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(statusType),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await mutations.updateTalk(ctx, args);
  },
  returns: v.id('talks'),
});

export const updateStatus = mutation({
  args: {
    id: v.id('talks'),
    status: statusType,
  },
  handler: async (ctx, args) => {
    return await mutations.updateTalkStatus(ctx, args);
  },
  returns: v.id('talks'),
});
