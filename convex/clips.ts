import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { speakerFields, statusType, talkFields, topicFields } from './schema';
import { getPublishedClips, getBySlugWithRelations } from './model/clips/queries';
import { createClip, updateClipStatus } from './model/clips/mutations';
import { clipFields } from './model/clips/schema';

export const getPublished = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object(clipFields)),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await getPublishedClips(ctx, limit);
  },
});

export const getBySlug = query({
  args: {
    limit: v.optional(v.number()),
    slug: v.string(),
  },
  returns: v.union(
    v.object({
      clip: v.object(clipFields),
      speaker: v.union(v.object(speakerFields), v.null()),
      talk: v.union(v.object(talkFields), v.null()),
      topics: v.array(v.object(topicFields)),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const { limit = 20, slug } = args;
    return await getBySlugWithRelations(ctx, slug, limit);
  },
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
  returns: v.id('clips'),
  handler: async (ctx, args) => {
    return await createClip(ctx, args);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id('clips'),
    status: statusType,
  },
  returns: v.id('clips'),
  handler: async (ctx, args) => {
    return await updateClipStatus(ctx, args);
  },
});
