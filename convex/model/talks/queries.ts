import type { Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { StatusType } from '../../lib/validators';

/**
 * Get talk by ID.
 *
 * @param ctx - Database context
 * @param id - Talk ID
 * @returns Talk or null if not found
 */
export async function getTalk(ctx: QueryCtx, id: Id<'talks'>) {
  return await ctx.db.get(id);
}

/**
 * Get talk by slug.
 *
 * @param ctx - Database context
 * @param slug - Talk slug
 * @returns Talk or null if not found
 */
export async function getTalkBySlug(ctx: QueryCtx, slug: string) {
  return await ctx.db
    .query('talks')
    .withIndex('by_slug', (q) => q.eq('slug', slug))
    .unique();
}

/**
 * Get talks with optional filters.
 *
 * @param ctx - Database context
 * @param options - Filter options
 * @returns Array of talks
 */
export async function getTalks(
  ctx: QueryCtx,
  options: {
    limit?: number;
    status?: StatusType;
  } = {},
) {
  const { limit = 20, status } = options;

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
 * @param options - Filter options
 * @returns Array of talks with speaker information
 */
export async function getTalksWithSpeakers(
  ctx: QueryCtx,
  options: {
    limit?: number;
    status?: StatusType;
  } = {},
) {
  const talks = await getTalks(ctx, options);

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
 * @param slug - Talk slug
 * @returns Talk with speaker and collection data
 */
export async function getTalkBySlugWithRelations(ctx: QueryCtx, slug: string) {
  const talk = await getTalkBySlug(ctx, slug);

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
 * @param speakerId - Speaker ID
 * @param status - Status filter
 * @param limit - Maximum number of results
 * @returns Array of talks
 */
export async function getTalksBySpeaker(
  ctx: QueryCtx,
  speakerId: Id<'speakers'>,
  status: StatusType,
  limit: number,
) {
  return await ctx.db
    .query('talks')
    .withIndex('by_speaker_id_and_status', (q) => q.eq('speakerId', speakerId).eq('status', status))
    .order('desc')
    .take(limit);
}

/**
 * Get talks by collection with status filter.
 *
 * @param ctx - Database context
 * @param collectionId - Collection ID
 * @param status - Status filter
 * @param limit - Maximum number of results
 * @returns Array of talks sorted by collection order
 */
export async function getTalksByCollection(
  ctx: QueryCtx,
  collectionId: Id<'collections'>,
  status: StatusType,
  limit: number,
) {
  const talks = await ctx.db
    .query('talks')
    .withIndex('by_collection_id_and_status', (q) =>
      q.eq('collectionId', collectionId).eq('status', status),
    )
    .take(limit);

  // Sort by collection order.
  const sortedTalks = talks.sort((a, b) => (a.collectionOrder || 0) - (b.collectionOrder || 0));

  return sortedTalks;
}
