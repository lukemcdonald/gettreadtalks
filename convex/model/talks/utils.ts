import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';

import { asyncMap } from 'convex-helpers';

import { enrichWithSpeaker } from '../../lib/utils';

/**
 * Enrich talks with topic slugs for client-side filtering.
 * Composable: works with raw talks or already-enriched talks.
 */
export async function enrichWithTopics<T extends { _id: Id<'talks'> }>(
  ctx: QueryCtx,
  talks: T[]
): Promise<(T & { topicSlugs: string[] })[]> {
  return await asyncMap(talks, async (talk: T) => {
    const talksOnTopics = await ctx.db
      .query('talksOnTopics')
      .withIndex('by_talkId', (q) => q.eq('talkId', talk._id))
      .collect();

    const topics = await Promise.all(
      talksOnTopics.map((tot) => ctx.db.get('topics', tot.topicId))
    );

    const topicSlugs = topics
      .filter((topic): topic is Doc<'topics'> => topic !== null)
      .map((topic) => topic.slug);

    return { ...talk, topicSlugs };
  });
}

function collectionTitleForTalk(
  collectionId: Id<'collections'> | undefined,
  titlesByCollectionId: Map<Id<'collections'>, string>
) {
  if (!collectionId) {
    return null;
  }

  return titlesByCollectionId.get(collectionId) ?? null;
}

async function featuredClipTitleForTalk(ctx: QueryCtx, talkId: Id<'talks'>) {
  const clip = await ctx.db
    .query('clips')
    .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
    .first();

  return clip?.title ?? null;
}

async function loadCollectionTitles(
  ctx: QueryCtx,
  talks: { collectionId?: Id<'collections'> }[]
) {
  const collectionIds = [
    ...new Set(
      talks.flatMap((talk) => (talk.collectionId ? [talk.collectionId] : []))
    ),
  ];
  const collections = await Promise.all(
    collectionIds.map((collectionId) => ctx.db.get('collections', collectionId))
  );

  return new Map(
    collections.flatMap((collection) =>
      collection ? [[collection._id, collection.title] as const] : []
    )
  );
}

export async function enrichAdminTalks(ctx: QueryCtx, talks: Doc<'talks'>[]) {
  const talksWithTopics = await enrichWithTopics(
    ctx,
    await enrichWithSpeaker(ctx, talks)
  );
  const titlesByCollectionId = await loadCollectionTitles(ctx, talksWithTopics);

  return await asyncMap(talksWithTopics, async (talk) => ({
    ...talk,
    collectionTitle: collectionTitleForTalk(
      talk.collectionId,
      titlesByCollectionId
    ),
    featuredClipTitle: await featuredClipTitleForTalk(ctx, talk._id),
  }));
}
