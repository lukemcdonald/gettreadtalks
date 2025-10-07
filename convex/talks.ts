import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { statusType } from './lib/validators';
import {
  getPublishedWithSpeakers,
  getBySlugWithRelations,
  getBySpeaker as getTalksBySpeaker,
  getByCollection as getTalksByCollection,
} from './model/talks/queries';
import { speakerFields } from './model/speakers/schema';
import { createTalk, updateTalkStatus } from './model/talks/mutations.js';
import { talkFields } from './model/talks/schema';

export const getPublished = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      ...talkFields,
      speaker: v.union(v.object(speakerFields), v.null()),
    }),
  ),
  handler: async (ctx, args) => {
    const { limit = 20 } = args;
    return await getPublishedWithSpeakers(ctx, limit);
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(
    v.object({
      talk: v.any(),
      collection: v.union(v.any(), v.null()),
      speaker: v.union(v.any(), v.null()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await getBySlugWithRelations(ctx, args.slug);
  },
});

export const getBySpeaker = query({
  args: {
    limit: v.optional(v.number()),
    speakerId: v.id('speakers'),
  },
  returns: v.array(v.object(talkFields)),
  handler: async (ctx, args) => {
    const { limit = 20, speakerId } = args;
    return await getTalksBySpeaker(ctx, speakerId, 'published', limit);
  },
});

export const getByCollection = query({
  args: {
    collectionId: v.id('collections'),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object(talkFields)),
  handler: async (ctx, args) => {
    const { collectionId, limit = 100 } = args;
    return await getTalksByCollection(ctx, collectionId, 'published', limit);
  },
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
  returns: v.id('talks'),
  handler: async (ctx, args) => {
    return await createTalk(ctx, args);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id('talks'),
    status: statusType,
  },
  returns: v.id('talks'),
  handler: async (ctx, args) => {
    return await updateTalkStatus(ctx, args);
  },
});
