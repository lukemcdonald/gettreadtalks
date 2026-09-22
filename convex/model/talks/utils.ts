import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';

import { asyncMap } from 'convex-helpers';

function speakerNameMatches(
  searchLower: string,
  speaker: Doc<'speakers'> | null
): boolean {
  if (!speaker) {
    return false;
  }

  return `${speaker.firstName ?? ''} ${speaker.lastName ?? ''}`
    .toLowerCase()
    .includes(searchLower);
}

function talkTitleMatches(searchLower: string, title: string): boolean {
  return title.toLowerCase().includes(searchLower);
}

/**
 * Title-match first, then load unique speakers only for remaining talks.
 */
// fallow-ignore-next-line complexity
export async function filterTalksByTitleOrSpeaker(
  ctx: QueryCtx,
  search: string,
  talks: Doc<'talks'>[]
): Promise<Doc<'talks'>[]> {
  const searchLower = search.toLowerCase();
  const remaining: Doc<'talks'>[] = [];
  const titleHitIds = new Set<Id<'talks'>>();

  for (const talk of talks) {
    if (talkTitleMatches(searchLower, talk.title)) {
      titleHitIds.add(talk._id);
    } else {
      remaining.push(talk);
    }
  }

  const speakerIds = [...new Set(remaining.map((talk) => talk.speakerId))];
  const speakers = await Promise.all(
    speakerIds.map((speakerId) => ctx.db.get('speakers', speakerId))
  );
  const matchingSpeakerIds = new Set(
    speakerIds.filter((speakerId, index) =>
      speakerNameMatches(searchLower, speakers[index] ?? null)
    )
  );
  const matchingIds = new Set(titleHitIds);

  for (const talk of remaining) {
    if (matchingSpeakerIds.has(talk.speakerId)) {
      matchingIds.add(talk._id);
    }
  }

  return talks.filter((talk) => matchingIds.has(talk._id));
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
