import type { Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { StatusType } from '../../lib/validators';

/**
 * Get published talks with speaker data.
 *
 * @param ctx - Database context
 * @param limit - Maximum number of results
 * @returns Array of talks with speaker information
 */
export async function getPublishedWithSpeakers(ctx: QueryCtx, limit: number) {
  const publishedTalks = await ctx.db
    .query('talks')
    .withIndex('by_status_and_published_at', (q) => q.eq('status', 'published'))
    .order('desc')
    .take(limit);

  const talksWithSpeakers = await Promise.all(
    publishedTalks.map(async (talk) => {
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
export async function getBySlugWithRelations(ctx: QueryCtx, slug: string) {
  const talk = await ctx.db
    .query('talks')
    .withIndex('by_slug', (q) => q.eq('slug', slug))
    .unique();

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
 * Get talks by speaker with status filter
 * @param ctx - Database context
 * @param speakerId - Speaker ID
 * @param status - Status filter
 * @param limit - Maximum number of results
 * @returns Array of talks
 */
export async function getBySpeaker(
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
export async function getByCollection(
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
