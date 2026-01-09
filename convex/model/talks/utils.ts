import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';

import { asyncMap } from 'convex-helpers';

/**
 * Apply search filter to talks array.
 */
export function applySearchFilter(talks: Doc<'talks'>[], search?: string): Doc<'talks'>[] {
  if (!search) {
    return talks;
  }
  const searchLower = search.toLowerCase();
  return talks.filter((talk) => talk.title.toLowerCase().includes(searchLower));
}

/**
 * Apply search filter with speaker data to talks+speaker array.
 */
export function applySearchFilterWithSpeaker(
  talks: Array<Doc<'talks'> & { speaker: Doc<'speakers'> | null }>,
  search?: string,
  searchType?: 'title' | 'speaker',
): Array<Doc<'talks'> & { speaker: Doc<'speakers'> | null }> {
  if (!search) {
    return talks;
  }

  const searchLower = search.toLowerCase();
  const type = searchType || 'title';

  return talks.filter((talk) => {
    if (type === 'title') {
      return talk.title.toLowerCase().includes(searchLower);
    }

    if (type === 'speaker' && talk.speaker) {
      const speakerName = `${talk.speaker.firstName} ${talk.speaker.lastName}`.toLowerCase();
      return speakerName.includes(searchLower);
    }

    return false;
  });
}

/**
 * Enrich items with speaker data.
 * Works with any entity that has a speakerId field (talks, clips, etc).
 */
export async function enrichWithSpeakers<T extends { speakerId: Id<'speakers'> }>(
  ctx: QueryCtx,
  items: T[],
): Promise<Array<T & { speaker: Doc<'speakers'> | null }>> {
  return await asyncMap(items, async (item: T) => {
    const speaker = await ctx.db.get('speakers', item.speakerId);
    return { ...item, speaker };
  });
}

/**
 * Enrich talks with topic slugs for client-side filtering.
 * Adds a topicSlugs array to each talk containing the slugs of all topics it belongs to.
 */
export async function enrichWithTopics<T extends Doc<'talks'>>(
  ctx: QueryCtx,
  talks: T[],
): Promise<Array<T & { topicSlugs: string[] }>> {
  return await asyncMap(talks, async (talk: T) => {
    const talksOnTopics = await ctx.db
      .query('talksOnTopics')
      .withIndex('by_talkId', (q) => q.eq('talkId', talk._id))
      .collect();

    const topics = await Promise.all(talksOnTopics.map((tot) => ctx.db.get('topics', tot.topicId)));

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
