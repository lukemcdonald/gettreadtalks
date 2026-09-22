import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';

import { asyncMap } from 'convex-helpers';

// fallow-ignore-next-line complexity
function talkMatchesTitleOrSpeaker(
  searchLower: string,
  talk: Doc<'talks'> & { speaker: Doc<'speakers'> | null }
): boolean {
  const titleHit = talk.title.toLowerCase().includes(searchLower);
  const speakerHit = Boolean(
    talk.speaker &&
    `${talk.speaker.firstName ?? ''} ${talk.speaker.lastName ?? ''}`
      .toLowerCase()
      .includes(searchLower)
  );

  return titleHit || speakerHit;
}

/**
 * Match talks whose title or speaker full name contains the query.
 */
export function applySearchFilterWithSpeaker(
  talks: (Doc<'talks'> & { speaker: Doc<'speakers'> | null })[],
  search?: string
): (Doc<'talks'> & { speaker: Doc<'speakers'> | null })[] {
  if (!search) {
    return talks;
  }

  const searchLower = search.toLowerCase();

  return talks.filter((talk) => talkMatchesTitleOrSpeaker(searchLower, talk));
}

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

/**
 * Get talks filtered by topic from talksOnTopics join table.
 */
export async function getTalksByTopic(ctx: QueryCtx, topicId: Id<'topics'>) {
  const talksOnTopics = await ctx.db
    .query('talksOnTopics')
    .withIndex('by_topicId', (q) => q.eq('topicId', topicId))
    .collect();

  const talkIds = talksOnTopics.map((t) => t.talkId);
  const talks = await Promise.all(talkIds.map((id) => ctx.db.get('talks', id)));

  return talks.filter((talk): talk is Doc<'talks'> => talk !== null);
}
