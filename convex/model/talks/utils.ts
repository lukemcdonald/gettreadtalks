import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';

import { asyncMap } from 'convex-helpers';

/**
 * Apply additional filters (status, featured, speakerId) to talks array.
 */
export function applyAdditionalFilters(
  talks: Doc<'talks'>[],
  filters: {
    featured?: boolean;
    speakerId?: Id<'speakers'>;
    status?: string;
  },
): Doc<'talks'>[] {
  let filteredTalks = talks;

  if (filters.status) {
    filteredTalks = filteredTalks.filter((talk) => talk.status === filters.status);
  }
  if (filters.featured !== undefined) {
    filteredTalks = filteredTalks.filter((talk) => talk.featured === filters.featured);
  }
  if (filters.speakerId) {
    filteredTalks = filteredTalks.filter((talk) => talk.speakerId === filters.speakerId);
  }

  return filteredTalks;
}

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
 * Enrich talks with speaker data.
 */
export async function enrichWithSpeakers(
  ctx: QueryCtx,
  talks: Doc<'talks'>[],
): Promise<Array<Doc<'talks'> & { speaker: Doc<'speakers'> | null }>> {
  return await asyncMap(talks, async (talk: Doc<'talks'>) => {
    const speaker = await ctx.db.get('speakers', talk.speakerId);
    return { ...talk, speaker };
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
