import type { PaginationOptions } from 'convex/server';

import { asyncMap } from 'convex-helpers';
import { getManyFrom, getManyVia, getOneFrom } from 'convex-helpers/server/relationships';

import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { StatusType } from '../../schema';
import type {
  GetTalkArgs,
  GetTalkBySlugArgs,
  ListTalksByCollectionArgs,
  ListTalksBySpeakerArgs,
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
  return await getOneFrom(ctx.db, 'talks', 'by_slug', args.slug);
}

/**
 * Get talks with optional filters and pagination.
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated talks
 */
export async function getTalks(
  ctx: QueryCtx,
  args: {
    paginationOpts: PaginationOptions;
    status?: StatusType;
  },
) {
  const { paginationOpts, status } = args;

  if (status) {
    return await ctx.db
      .query('talks')
      .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
      .order('desc')
      .paginate(paginationOpts);
  }

  return await ctx.db.query('talks').order('desc').paginate(paginationOpts);
}

/**
 * Get talks with speaker data (paginated).
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated talks with speaker information
 */
export async function getTalksWithSpeakers(
  ctx: QueryCtx,
  args: {
    paginationOpts: PaginationOptions;
    status?: StatusType;
  },
) {
  const result = await getTalks(ctx, args);

  const enrichedPage = await asyncMap(result.page, async (talk: Doc<'talks'>) => {
    const speaker = await ctx.db.get(talk.speakerId);
    return { ...talk, speaker };
  });

  return {
    ...result,
    page: enrichedPage,
  };
}

/**
 * Get talk by slug with related data.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Talk with speaker, collection, clips, and topics data
 */
export async function getTalkBySlugWithRelations(ctx: QueryCtx, args: GetTalkBySlugArgs) {
  const talk = await getTalkBySlug(ctx, args);

  if (!talk) {
    return null;
  }

  const queries = {
    clips: ctx.db
      .query('clips')
      .withIndex('by_talkId_and_status', (q) => q.eq('talkId', talk._id).eq('status', 'published'))
      .collect(),
    collection: talk.collectionId ? ctx.db.get(talk.collectionId) : null,
    speaker: talk.speakerId ? ctx.db.get(talk.speakerId) : null,
    topics: getManyVia(ctx.db, 'talksOnTopics', 'topicId', 'by_talkId', talk._id, 'talkId'),
  };

  const [clips, collection, speaker, topics] = await Promise.all([
    queries.clips,
    queries.collection,
    queries.speaker,
    queries.topics,
  ]);

  // Filter out any null topics
  const validTopics = topics.filter((topic) => topic !== null);

  return {
    clips,
    collection,
    speaker,
    talk,
    topics: validTopics,
  };
}

/**
 * Get talks by speaker with status filter.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of talks
 */
export async function getTalksBySpeaker(ctx: QueryCtx, args: ListTalksBySpeakerArgs) {
  const { limit = 20, speakerId } = args;

  return await ctx.db
    .query('talks')
    .withIndex('by_speakerId_and_status', (q) =>
      q.eq('speakerId', speakerId as Id<'speakers'>).eq('status', 'published'),
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
export async function getTalksByCollection(ctx: QueryCtx, args: ListTalksByCollectionArgs) {
  const { collectionId, limit = 100 } = args;

  const talks = await ctx.db
    .query('talks')
    .withIndex('by_collectionId_and_status', (q) =>
      q.eq('collectionId', collectionId).eq('status', 'published'),
    )
    .take(limit);

  // Sort by collection order.
  const sortedTalks = talks.sort((a, b) => (a.collectionOrder || 0) - (b.collectionOrder || 0));

  return sortedTalks;
}

/**
 * Get featured talks (random selection).
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of random featured talks
 */
export async function listFeaturedTalks(ctx: QueryCtx, args: { limit?: number } = {}) {
  const { limit = 5 } = args;

  // Intentionally unbounded: Need all featured talks for random selection
  // Limited to 50 to prevent memory issues if featured talks grow
  const talks = await ctx.db
    .query('talks')
    .withIndex('by_featured_and_status', (q) => q.eq('featured', true).eq('status', 'published'))
    .take(50);

  // Shuffle and return limited number
  const shuffled = talks.sort(() => Math.random() - 0.5);

  return shuffled.slice(0, limit);
}

/**
 * Get random talks by speaker (excluding a specific talk).
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Array of random talks by speaker
 */
export async function getRandomTalksBySpeaker(
  ctx: QueryCtx,
  args: { excludeTalkId?: string; limit?: number; speakerId: Id<'speakers'> },
) {
  const { excludeTalkId, limit = 5, speakerId } = args;

  const talks = await ctx.db
    .query('talks')
    .withIndex('by_speakerId_and_status', (q) =>
      q.eq('speakerId', speakerId).eq('status', 'published'),
    )
    .collect();

  // Filter out excluded talk if provided
  const filteredTalks = excludeTalkId ? talks.filter((talk) => talk._id !== excludeTalkId) : talks;

  // Shuffle and return limited number
  const shuffled = filteredTalks.sort(() => Math.random() - 0.5);

  return shuffled.slice(0, limit);
}

/**
 * Get total count of published talks.
 *
 * @param ctx - Database context
 * @returns Count of published talks
 */
export async function getTalksCount(ctx: QueryCtx) {
  const talks = await getManyFrom(
    ctx.db,
    'talks',
    'by_status_and_publishedAt',
    'published',
    'status',
  );

  return talks.length;
}
