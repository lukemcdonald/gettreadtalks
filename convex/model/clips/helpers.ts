import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { PaginationOptions } from 'convex/server';

import { asyncMap } from 'convex-helpers';

import { filterClipsByPublishedTalks } from '../../lib/filters';

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
  const result = await publishedClipsQuery(ctx).paginate(paginationOpts);

  return {
    ...result,
    page: await filterClipsByPublishedTalks(ctx, result.page),
  };
}

export async function searchPublishedClips(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  const clips = await filterClipsByPublishedTalks(
    ctx,
    await ctx.db
      .query('clips')
      .withSearchIndex('search_title', (q) =>
        q.search('title', queryText).eq('status', 'published')
      )
      .take(limit)
  );

  return clips.slice(0, limit);
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
