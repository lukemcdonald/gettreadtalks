import { v } from 'convex/values';

import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { requireAuth } from './lib/permissions';
import { speakerFields } from './schema';
import { normalizeSlug } from './utils';

// Public query - returns all speakers
export const list = query({
  args: {},
  returns: v.array(v.object(speakerFields)),
  handler: async (ctx) => {
    return await ctx.db.query('speakers').collect();
  },
});

// Public query - returns speaker by slug
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(v.object(speakerFields), v.null()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('speakers')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique();
  },
});

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
  returns: v.id('speakers'),
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const slug = normalizeSlug(`${args.firstName} ${args.lastName}`);

    const existing = await ctx.db
      .query('speakers')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .first();

    if (existing) {
      throw new Error('Speaker with this name already exists');
    }

    return await ctx.db.insert('speakers', {
      ...args,
      createdAt: Date.now(),
      slug,
    });
  },
});

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
  returns: v.id('speakers'),
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const { id, ...rest } = args;
    const updates: Partial<Doc<'speakers'>> = rest;

    const speaker = await ctx.db.get(id);

    if (!speaker) {
      throw new Error('Speaker not found');
    }

    // If name changed, update slug
    if (updates.firstName || updates.lastName) {
      const firstName = updates.firstName || speaker.firstName;
      const lastName = updates.lastName || speaker.lastName;
      const newSlug = normalizeSlug(`${firstName} ${lastName}`);

      if (newSlug !== speaker.slug) {
        const existing = await ctx.db
          .query('speakers')
          .withIndex('by_slug', (q) => q.eq('slug', newSlug))
          .first();

        if (existing && existing._id !== id) {
          throw new Error('Speaker with this name already exists');
        }

        updates.slug = newSlug;
      }
    }

    updates.updatedAt = Date.now();

    await ctx.db.patch(id, updates);

    return id;
  },
});
