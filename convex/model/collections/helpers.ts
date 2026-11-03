import type { Doc } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { PaginationOptions } from 'convex/server';

import { asyncMap } from 'convex-helpers';
import { getAll } from 'convex-helpers/server/relationships';

import { filterCollectionsWithPublishedTalks } from '../../lib/filters';
import { paginateArray } from '../../lib/utils';
import { LIST_SEARCH_LIMIT, normalizeSearchQuery } from '../search/helpers';
import { listTalksForCollection } from '../talks/helpers';

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

export async function searchCollections(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  return await ctx.db
    .query('collections')
    .withSearchIndex('search_title', (q) => q.search('title', queryText))
    .take(limit);
}

export async function loadSpeakersForTalks(
  ctx: QueryCtx,
  talks: Doc<'talks'>[]
) {
  const speakerIds = [...new Set(talks.map((talk) => talk.speakerId))];
  const speakers = await getAll(ctx.db, speakerIds);

  return speakers.filter((speaker) => speaker !== null);
}

export async function enrichCollectionsForAdmin(
  ctx: QueryCtx,
  collections: Doc<'collections'>[]
) {
  return await asyncMap(collections, async (collection) => {
    const talks = await listTalksForCollection(ctx, collection._id);
    const speakers = await loadSpeakersForTalks(ctx, talks);
    const hasPublishedTalk = talks.some((talk) => talk.status === 'published');

    return {
      collection,
      speakers,
      status: hasPublishedTalk ? ('published' as const) : ('draft' as const),
      talkCount: talks.length,
    };
  });
}

export async function listCollectionsForAdmin(
  ctx: QueryCtx,
  options: {
    paginationOpts: PaginationOptions;
    search?: string;
    status: 'all' | 'draft' | 'published';
  }
) {
  const queryText = normalizeSearchQuery(options.search ?? '');
  const collections =
    queryText.length > 0
      ? await searchCollections(ctx, queryText, LIST_SEARCH_LIMIT)
      : await publishedCollectionsQuery(ctx).collect();
  let filtered = collections;

  if (options.status !== 'all') {
    const published = await filterCollectionsWithPublishedTalks(
      ctx,
      collections
    );

    if (options.status === 'published') {
      filtered = published;
    } else {
      const publishedIds = new Set(
        published.map((collection) => collection._id)
      );

      filtered = collections.filter(
        (collection) => !publishedIds.has(collection._id)
      );
    }
  }

  const result = paginateArray(
    filtered,
    options.paginationOpts.cursor,
    options.paginationOpts.numItems
  );

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    page: await enrichCollectionsForAdmin(ctx, result.page),
  };
}
