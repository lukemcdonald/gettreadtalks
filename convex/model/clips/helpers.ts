import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { StatusFilterType } from '../../lib/types';
import type { PaginationOptions } from 'convex/server';

import { asyncMap } from 'convex-helpers';

import { filterClipsByPublishedTalks } from '../../lib/filters';
import { loadFullPage } from '../../lib/utils';
import { searchTitleQuery } from '../search/helpers';

function publishedClipsQuery(ctx: QueryCtx) {
  return ctx.db
    .query('clips')
    .withIndex('by_status_and_publishedAt', (q) => q.eq('status', 'published'))
    .order('desc');
}

export async function listPublishedClips(ctx: QueryCtx) {
  return await filterClipsByPublishedTalks(
    ctx,
    await publishedClipsQuery(ctx).collect()
  );
}

export async function listPublishedClipsPage(
  ctx: QueryCtx,
  paginationOpts: PaginationOptions
) {
  return await loadFullPage(
    (opts) => publishedClipsQuery(ctx).paginate(opts),
    (clips) => filterClipsByPublishedTalks(ctx, clips),
    paginationOpts
  );
}

export async function searchClips(
  ctx: QueryCtx,
  queryText: string,
  limit: number,
  status?: StatusFilterType
) {
  return await ctx.db
    .query('clips')
    .withSearchIndex('search_title', searchTitleQuery(queryText, status))
    .take(limit);
}

export async function loadPublishedClipSearchPage(
  ctx: QueryCtx,
  queryText: string,
  paginationOpts: PaginationOptions,
  accept: (clips: Doc<'clips'>[]) => Promise<Doc<'clips'>[]>
) {
  return await loadFullPage(
    (opts) =>
      ctx.db
        .query('clips')
        .withSearchIndex(
          'search_title',
          searchTitleQuery(queryText, 'published')
        )
        .paginate(opts),
    accept,
    paginationOpts
  );
}

export async function searchPublishedClips(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  const page: Doc<'clips'>[] = [];
  let cursor: string | null = null;
  let isDone = false;

  while (page.length < limit && !isDone) {
    // oxlint-disable-next-line no-await-in-loop -- the next search cursor depends on this page
    const result = await loadPublishedClipSearchPage(
      ctx,
      queryText,
      { cursor, numItems: limit - page.length },
      (clips) => filterClipsByPublishedTalks(ctx, clips)
    );

    const {
      continueCursor: nextCursor,
      isDone: pageDone,
      page: sourcePage,
    } = result;

    page.push(...sourcePage);
    isDone = pageDone;

    if (sourcePage.length === 0 && (pageDone || nextCursor === cursor)) {
      break;
    }

    cursor = nextCursor;
  }

  return page;
}

export async function enrichClipsWithSpeaker<
  T extends { speakerId?: Id<'speakers'> },
>(
  ctx: QueryCtx,
  items: T[]
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
  clips: Doc<'clips'>[]
) {
  const clipsWithSpeakers = await enrichClipsWithSpeaker(ctx, clips);

  return await asyncMap(clipsWithSpeakers, async (clip) => {
    const talk = clip.talkId ? await ctx.db.get('talks', clip.talkId) : null;

    return {
      ...clip,
      talkTitle: talk?.title ?? null,
    };
  });
}
