import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { StatusFilterType } from '../../lib/types';
import type { PaginationOptions } from 'convex/server';

import { asyncMap } from 'convex-helpers';

import { filterClipsWithPublishedTalk } from '../../lib/filters';
import { loadUntilFull } from '../../lib/utils';
import { searchTitleQuery } from '../search/helpers';

function publishedClipsQuery(ctx: QueryCtx) {
  return ctx.db
    .query('clips')
    .withIndex('by_status_and_publishedAt', (q) => q.eq('status', 'published'))
    .order('desc');
}

export async function listPublishedClips(ctx: QueryCtx) {
  return await filterClipsWithPublishedTalk(ctx, {
    clips: await publishedClipsQuery(ctx).collect(),
  });
}

export async function listPublishedClipsPage(
  ctx: QueryCtx,
  { paginationOpts }: { paginationOpts: PaginationOptions }
) {
  const result = await publishedClipsQuery(ctx).paginate(paginationOpts);

  return {
    ...result,
    page: await filterClipsWithPublishedTalk(ctx, { clips: result.page }),
  };
}

export async function searchClips(
  ctx: QueryCtx,
  {
    limit,
    queryText,
    status,
  }: {
    limit: number;
    queryText: string;
    status?: StatusFilterType;
  }
) {
  return await ctx.db
    .query('clips')
    .withSearchIndex('search_title', searchTitleQuery(queryText, status))
    .take(limit);
}

export async function searchPublishedClips(
  ctx: QueryCtx,
  {
    limit,
    queryText,
  }: {
    limit: number;
    queryText: string;
  }
) {
  return await loadUntilFull(
    ctx.db
      .query('clips')
      .withSearchIndex(
        'search_title',
        searchTitleQuery(queryText, 'published')
      ),
    async (clip) => {
      if (!clip.talkId) {
        return true;
      }

      const talk = await ctx.db.get('talks', clip.talkId);

      return talk?.status === 'published';
    },
    limit
  );
}

export async function enrichClipsWithSpeaker<
  T extends { speakerId?: Id<'speakers'> },
>(
  ctx: QueryCtx,
  { items }: { items: T[] }
): Promise<(T & { speaker: Doc<'speakers'> | null })[]> {
  return await asyncMap(items, async (item: T) => {
    const speaker = item.speakerId
      ? await ctx.db.get('speakers', item.speakerId)
      : null;

    return { ...item, speaker };
  });
}

export async function enrichClipsForAdmin(
  ctx: QueryCtx,
  { clips }: { clips: Doc<'clips'>[] }
) {
  const clipsWithSpeakers = await enrichClipsWithSpeaker(ctx, { items: clips });

  return await asyncMap(clipsWithSpeakers, async (clip) => {
    const talk = clip.talkId ? await ctx.db.get('talks', clip.talkId) : null;

    return {
      ...clip,
      talkTitle: talk?.title ?? null,
    };
  });
}
