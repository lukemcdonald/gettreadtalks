import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { doc, docs } from './lib/validators/schema';
import { mutations, queries } from './model/speakers';

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: {
    id: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    return await queries.getSpeaker(ctx, args);
  },
  returns: doc('speakers', true),
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await queries.getSpeakerBySlug(ctx, args);
  },
  returns: doc('speakers', true),
});

export const getCount = query({
  args: {},
  handler: async (ctx) => {
    return await queries.getSpeakersCount(ctx);
  },
  returns: v.number(),
});

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await queries.getSpeakers(ctx, args);
  },
  returns: v.any(), // PaginationResult<Doc<'speakers'>>
});

export const listFeatured = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await queries.listFeaturedSpeakers(ctx, args);
  },
  returns: docs('speakers'),
});

// ============================================
// MUTATIONS
// ============================================

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
    return await mutations.createSpeaker(ctx, args);
  },
  returns: v.id('speakers'),
});

export const destroy = mutation({
  args: {
    id: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    return await mutations.destroySpeaker(ctx, args);
  },
  returns: v.null(),
});

export const update = mutation({
  args: {
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    firstName: v.optional(v.string()),
    id: v.id('speakers'),
    imageUrl: v.optional(v.string()),
    lastName: v.optional(v.string()),
    ministry: v.optional(v.string()),
    role: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await mutations.updateSpeaker(ctx, args);
  },
  returns: v.id('speakers'),
});
