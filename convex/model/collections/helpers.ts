import type { QueryCtx } from '../../_generated/server';
import type { PaginationOptions } from 'convex/server';

import { filterCollectionsWithPublishedTalks } from '../../lib/filters';

function publishedCollectionsQuery(ctx: QueryCtx) {
  return ctx.db.query('collections').order('desc');
}

export async function listPublishedCollections(ctx: QueryCtx) {
  return await filterCollectionsWithPublishedTalks(
    ctx,
    await publishedCollectionsQuery(ctx).collect()
  );
}

export async function listPublishedCollectionsPage(
  ctx: QueryCtx,
  paginationOpts: PaginationOptions
) {
  const collectionPages =
    await publishedCollectionsQuery(ctx).paginate(paginationOpts);

  return {
    ...collectionPages,
    page: await filterCollectionsWithPublishedTalks(ctx, collectionPages.page),
  };
}
