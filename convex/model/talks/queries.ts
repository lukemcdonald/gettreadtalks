import type { QueryCtx } from '../../_generated/server';

import type {
  GetTalkArgs,
  GetTalkBySlugArgs,
  GetTalksByCollectionArgs,
  GetTalksBySpeakerArgs,
  ListTalksArgs,
} from './types';

/**
 * Get talk by ID.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Talk or null if not found
 */
export async function getTalk(ctx: QueryCtx, args: GetTalkArgs) {
  return await ctx.db.get(args.id);
}

/**
 * Get talk by slug.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Talk or null if not found
 */
export async function getTalkBySlug(ctx: QueryCtx, args: GetTalkBySlugArgs) {
  return await ctx.db
    .query('talks')
    .withIndex('by_slug', (q) => q.eq('slug', args.slug))
    .unique();
}

/**
 * Get talks with optional filters.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of talks
 */
export async function getTalks(ctx: QueryCtx, args: ListTalksArgs) {
  const { limit = 20, status } = args;

  if (status) {
    return await ctx.db
      .query('talks')
      .withIndex('by_status_and_published_at', (q) => q.eq('status', status))
      .order('desc')
      .take(limit);
  }

  return await ctx.db.query('talks').take(limit);
}

/**
 * Get talks with speaker data.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of talks with speaker information
 */
export async function getTalksWithSpeakers(ctx: QueryCtx, args: ListTalksArgs) {
  const talks = await getTalks(ctx, args);

  const talksWithSpeakers = await Promise.all(
    talks.map(async (talk) => {
      const speaker = await ctx.db.get(talk.speakerId);
      return { ...talk, speaker };
    }),
  );

  return talksWithSpeakers;
}

/**
 * Get talk by slug with related data.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Talk with speaker and collection data
 */
export async function getTalkBySlugWithRelations(ctx: QueryCtx, args: GetTalkBySlugArgs) {
  const talk = await getTalkBySlug(ctx, args);

  if (!talk) {
    return null;
  }

  const queries = {
    collection: talk.collectionId ? ctx.db.get(talk.collectionId) : null,
    speaker: talk.speakerId ? ctx.db.get(talk.speakerId) : null,
  };

  const [collection, speaker] = await Promise.all([queries.collection, queries.speaker]);

  return {
    collection,
    speaker,
    talk,
  };
}

/**
 * Get talks by speaker with status filter.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of talks
 */
export async function getTalksBySpeaker(ctx: QueryCtx, args: GetTalksBySpeakerArgs) {
  const { limit = 20, speakerId } = args;

  return await ctx.db
    .query('talks')
    .withIndex('by_speaker_id_and_status', (q) =>
      q.eq('speakerId', speakerId).eq('status', 'published'),
    )
    .order('desc')
    .take(limit);
}

/**
 * Get talks by collection with status filter.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of talks sorted by collection order
 */
export async function getTalksByCollection(ctx: QueryCtx, args: GetTalksByCollectionArgs) {
  const { collectionId, limit = 100 } = args;

  const talks = await ctx.db
    .query('talks')
    .withIndex('by_collection_id_and_status', (q) =>
      q.eq('collectionId', collectionId).eq('status', 'published'),
    )
    .take(limit);

  // Sort by collection order.
  const sortedTalks = talks.sort((a, b) => (a.collectionOrder || 0) - (b.collectionOrder || 0));

  return sortedTalks;
}
