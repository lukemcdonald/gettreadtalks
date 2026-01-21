import type { Doc, Id } from '../_generated/dataModel';
import type { QueryCtx } from '../_generated/server';

import { getOneFrom } from 'convex-helpers/server/relationships';

/**
 * Filter speakers to only those with at least one published talk or clip.
 * Used in public-facing queries to show only active speakers.
 */
export async function filterSpeakersWithPublishedTalks(
  ctx: QueryCtx,
  speakers: Doc<'speakers'>[],
): Promise<Doc<'speakers'>[]> {
  const results = await Promise.all(
    speakers.map(async (speaker) => {
      const [hasTalks, hasClips] = await Promise.all([
        ctx.db
          .query('talks')
          .withIndex('by_speakerId_and_status', (q) =>
            q.eq('speakerId', speaker._id).eq('status', 'published'),
          )
          .first(),
        ctx.db
          .query('clips')
          .withIndex('by_speakerId_and_status', (q) =>
            q.eq('speakerId', speaker._id).eq('status', 'published'),
          )
          .first(),
      ]);

      return hasTalks || hasClips ? speaker : null;
    }),
  );

  return results.filter((s): s is Doc<'speakers'> => s !== null);
}

/**
 * Filter clips to only those with published parent talks.
 * Clips without a parent talk (standalone clips) are included.
 * Used in public-facing queries to ensure content integrity.
 */
export async function filterClipsByPublishedTalks(
  ctx: QueryCtx,
  clips: Doc<'clips'>[],
): Promise<Doc<'clips'>[]> {
  const results = await Promise.all(
    clips.map(async (clip) => {
      if (!clip.talkId) {
        return clip;
      }

      const talk = await ctx.db.get('talks', clip.talkId);
      return talk?.status === 'published' ? clip : null;
    }),
  );

  return results.filter((c): c is Doc<'clips'> => c !== null);
}

/**
 * Filter collections to only those with at least one published talk.
 * Used in public-facing queries to show only active collections.
 */
export async function filterCollectionsWithPublishedTalks(
  ctx: QueryCtx,
  collections: Doc<'collections'>[],
): Promise<Doc<'collections'>[]> {
  const results = await Promise.all(
    collections.map(async (collection) => {
      const hasTalks = await ctx.db
        .query('talks')
        .withIndex('by_collectionId_and_status', (q) =>
          q.eq('collectionId', collection._id).eq('status', 'published'),
        )
        .first();

      return hasTalks ? collection : null;
    }),
  );

  return results.filter((c): c is Doc<'collections'> => c !== null);
}

/**
 * Filter topics to only those with at least one published talk.
 * Used in public-facing queries to show only active topics.
 */
export async function filterTopicsWithPublishedTalks(
  ctx: QueryCtx,
  topics: Doc<'topics'>[],
): Promise<Doc<'topics'>[]> {
  const results = await Promise.all(
    topics.map(async (topic) => {
      const talksOnTopics = await ctx.db
        .query('talksOnTopics')
        .withIndex('by_topicId', (q) => q.eq('topicId', topic._id))
        .collect();

      const talks = await Promise.all(
        talksOnTopics.map((entry) => ctx.db.get('talks', entry.talkId)),
      );

      const hasPublishedTalks = talks.some(
        (talk): talk is Doc<'talks'> => talk !== null && talk.status === 'published',
      );

      return hasPublishedTalks ? topic : null;
    }),
  );

  return results.filter((t): t is Doc<'topics'> => t !== null);
}

/**
 * Get talk IDs that match any of the given topic slugs.
 * Returns null if no valid topics found (to signal "no results").
 */
export async function getTalkIdsByTopicSlugs(
  ctx: QueryCtx,
  topicSlugs: string[],
): Promise<Set<Id<'talks'>> | null> {
  const topics = await Promise.all(
    topicSlugs.map((slug) => getOneFrom(ctx.db, 'topics', 'by_slug', slug)),
  );
  const validTopics = topics.filter((t): t is Doc<'topics'> => t !== null);

  if (validTopics.length === 0) {
    return null;
  }

  const talkIds = new Set<Id<'talks'>>();
  for (const topic of validTopics) {
    const entries = await ctx.db
      .query('talksOnTopics')
      .withIndex('by_topicId', (q) => q.eq('topicId', topic._id))
      .collect();
    for (const entry of entries) {
      talkIds.add(entry.talkId);
    }
  }

  return talkIds;
}

/**
 * Get clip IDs that match any of the given topic slugs.
 * Returns null if no valid topics found (to signal "no results").
 */
export async function getClipIdsByTopicSlugs(
  ctx: QueryCtx,
  topicSlugs: string[],
): Promise<Set<Id<'clips'>> | null> {
  const topics = await Promise.all(
    topicSlugs.map((slug) => getOneFrom(ctx.db, 'topics', 'by_slug', slug)),
  );
  const validTopics = topics.filter((t): t is Doc<'topics'> => t !== null);

  if (validTopics.length === 0) {
    return null;
  }

  const clipIds = new Set<Id<'clips'>>();
  for (const topic of validTopics) {
    const entries = await ctx.db
      .query('clipsOnTopics')
      .withIndex('by_topicId', (q) => q.eq('topicId', topic._id))
      .collect();
    for (const entry of entries) {
      clipIds.add(entry.clipId);
    }
  }

  return clipIds;
}
