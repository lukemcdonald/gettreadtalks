import type { QueryCtx } from '../../_generated/server';
import type { PaginationOptions } from 'convex/server';

import { filterCollectionsWithPublishedTalks } from '../../lib/filters';

export async function listPublishedCollections(
  ctx: QueryCtx,
  options: { paginationOpts: PaginationOptions }
) {
  const collectionPages = await ctx.db
    .query('collections')
    .order('desc')
    .paginate(options.paginationOpts);

  return {
    ...collectionPages,
    page: await filterCollectionsWithPublishedTalks(ctx, collectionPages.page),
  };
}
