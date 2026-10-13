import type { Doc } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { PaginationOptions, PaginationResult } from 'convex/server';

import { filterClipsByPublishedTalks } from '../../lib/filters';

function publishedClipsQuery(ctx: QueryCtx) {
  return ctx.db
    .query('clips')
    .withIndex('by_status_and_publishedAt', (q) => q.eq('status', 'published'))
    .order('desc');
}

export async function listPublishedClips(
  ctx: QueryCtx,
  options: { paginationOpts: PaginationOptions }
): Promise<PaginationResult<Doc<'clips'>>>;
export async function listPublishedClips(
  ctx: QueryCtx
): Promise<Doc<'clips'>[]>;
export async function listPublishedClips(
  ctx: QueryCtx,
  options?: { paginationOpts: PaginationOptions }
): Promise<Doc<'clips'>[] | PaginationResult<Doc<'clips'>>> {
  const clipsQuery = publishedClipsQuery(ctx);

  if (options?.paginationOpts) {
    const result = await clipsQuery.paginate(options.paginationOpts);

    return {
      ...result,
      page: await filterClipsByPublishedTalks(ctx, result.page),
    };
  }

  return await filterClipsByPublishedTalks(ctx, await clipsQuery.collect());
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
