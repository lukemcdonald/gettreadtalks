import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { statusType } from './lib/validators';
import { speakerFields } from './model/speakers/schema';
import { createTalk, updateTalkStatus } from './model/talks/mutations.js';
import {
  getBySlugWithRelations,
  getPublishedWithSpeakers,
  getByCollection as getTalksByCollection,
  getBySpeaker as getTalksBySpeaker,
} from './model/talks/queries';
import { talkFields } from './model/talks/schema';

export const getPublished = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 20 } = args;
    return await getPublishedWithSpeakers(ctx, limit);
  },
  returns: v.array(
    v.object({
      ...talkFields,
      speaker: v.union(v.object(speakerFields), v.null()),
    }),
  ),
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await getBySlugWithRelations(ctx, args.slug);
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
  args: {
    limit: v.optional(v.number()),
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    const { limit = 20, speakerId } = args;
    return await getTalksBySpeaker(ctx, speakerId, 'published', limit);
  },
  returns: v.array(v.object(talkFields)),
});

export const getByCollection = query({
  args: {
    collectionId: v.id('collections'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { collectionId, limit = 100 } = args;
    return await getTalksByCollection(ctx, collectionId, 'published', limit);
  },
  returns: v.array(v.object(talkFields)),
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
    return await createTalk(ctx, args);
  },
  returns: v.id('talks'),
});

export const updateStatus = mutation({
  args: {
    id: v.id('talks'),
    status: statusType,
  },
  handler: async (ctx, args) => {
    return await updateTalkStatus(ctx, args);
  },
  returns: v.id('talks'),
});
