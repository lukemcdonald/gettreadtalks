import type { PaginationOptions } from 'convex/server';

import type { Id } from '../../_generated/dataModel';
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
  return await ctx.db
    .query('talks')
    .withIndex('by_slug', (q) => q.eq('slug', args.slug))
    .unique();
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
  args: { paginationOpts: PaginationOptions; status?: StatusType },
) {
  const { paginationOpts, status } = args;

  if (status) {
    return await ctx.db
      .query('talks')
      .withIndex('by_status_and_published_at', (q) => q.eq('status', status))
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
  args: { paginationOpts: PaginationOptions; status?: StatusType },
) {
  const result = await getTalks(ctx, args);

  const enrichedPage = await Promise.all(
    result.page.map(async (talk) => {
      const speaker = await ctx.db.get(talk.speakerId);
      return { ...talk, speaker };
    }),
  );

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
      .withIndex('by_talk_id_and_status', (q) => q.eq('talkId', talk._id).eq('status', 'published'))
      .collect(),
    collection: talk.collectionId ? ctx.db.get(talk.collectionId) : null,
    speaker: talk.speakerId ? ctx.db.get(talk.speakerId) : null,
    talkTopics: ctx.db
      .query('talksOnTopics')
      .withIndex('by_talk_id', (q) => q.eq('talkId', talk._id))
      .collect(),
  };

  const [clips, collection, speaker, talkTopics] = await Promise.all([
    queries.clips,
    queries.collection,
    queries.speaker,
    queries.talkTopics,
  ]);

  // Fetch all topics in parallel
  const topics = await Promise.all(
    talkTopics.map(async (talkTopic) => {
      return await ctx.db.get(talkTopic.topicId);
    }),
  );

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
    .withIndex('by_speaker_id_and_status', (q) =>
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
    .withIndex('by_collection_id_and_status', (q) =>
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
export async function getFeaturedTalks(ctx: QueryCtx, args: { limit?: number } = {}) {
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
    .withIndex('by_speaker_id_and_status', (q) =>
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
  // Intentionally unbounded: Used only for counting total talks
  // TODO: Replace with ctx.db.query('talks').withIndex(...).count() when available
  const talks = await ctx.db
    .query('talks')
    .withIndex('by_status_and_published_at', (q) => q.eq('status', 'published'))
    .collect();

  return talks.length;
}

/**
 * Get count of talks by topic.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Count of talks for topic
 */
export async function getTalksCountByTopic(ctx: QueryCtx, args: { topicId: Id<'topics'> }) {
  // Intentionally unbounded: Used only for counting talks in topic
  // TODO: Replace with ctx.db.query(...).count() when available
  const talkTopics = await ctx.db
    .query('talksOnTopics')
    .withIndex('by_topic_id', (q) => q.eq('topicId', args.topicId))
    .collect();

  return talkTopics.length;
}

/**
 * Get count of talks by collection.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Count of talks in collection
 */
export async function getTalksCountByCollection(
  ctx: QueryCtx,
  args: { collectionId: Id<'collections'> },
) {
  const talks = await ctx.db
    .query('talks')
    .withIndex('by_collection_id_and_status', (q) =>
      q.eq('collectionId', args.collectionId).eq('status', 'published'),
    )
    .collect();

  return talks.length;
}
