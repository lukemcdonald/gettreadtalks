import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { normalizeSlug } from "./utils";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("collections").collect();
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("collections")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getWithTalks = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const collection = await ctx.db
      .query("collections")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!collection) {
      return null;
    }

    const talks = await ctx.db
      .query("talks")
      .withIndex("by_collection_id_and_order", (q) => q.eq("collectionId", collection._id))
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();

    // Sort by collectionOrder
    talks.sort((a, b) => (a.collectionOrder || 0) - (b.collectionOrder || 0));

    return {
      collection,
      talks,
    };
  },
});

export const create = mutation({
  args: {
    description: v.optional(v.string()),
    title: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const slug = normalizeSlug(args.title);

    const existing = await ctx.db
      .query("collections")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (existing) {
      throw new Error("Collection with this title already exists");
    }

    return await ctx.db.insert("collections", {
      ...args,
      slug,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    description: v.optional(v.string()),
    id: v.id("collections"),
    title: v.optional(v.string()),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const collection = await ctx.db.get(id);

    if (!collection) {
      throw new Error("Collection not found");
    }

    if (updates.title) {
      const newSlug = normalizeSlug(updates.title);

      if (newSlug !== collection.slug) {
        const existing = await ctx.db
          .query("collections")
          .withIndex("by_slug", (q) => q.eq("slug", newSlug))
          .first();

        if (existing && existing._id !== id) {
          throw new Error("Collection with this title already exists");
        }

        (updates as any).slug = newSlug;
      }
    }

    (updates as any).updatedAt = Date.now();

    await ctx.db.patch(id, updates);

    return id;
  },
});
