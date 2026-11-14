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
  return await filterCollectionsWithPublishedTalks(ctx, {
    collections: await publishedCollectionsQuery(ctx).collect(),
  });
}

export async function listPublishedCollectionsPage(
  ctx: QueryCtx,
  { paginationOpts }: { paginationOpts: PaginationOptions }
) {
  const collectionPages =
    await publishedCollectionsQuery(ctx).paginate(paginationOpts);

  return {
    ...collectionPages,
    page: await filterCollectionsWithPublishedTalks(ctx, {
      collections: collectionPages.page,
    }),
  };
}

export async function searchCollections(
  ctx: QueryCtx,
  {
    limit,
    queryText,
  }: {
    limit: number;
    queryText: string;
  }
) {
  return await ctx.db
    .query('collections')
    .withSearchIndex('search_title', (q) => q.search('title', queryText))
    .take(limit);
}

export async function loadSpeakersForTalks(
  ctx: QueryCtx,
  { talks }: { talks: Doc<'talks'>[] }
) {
  const speakerIds = [...new Set(talks.map((talk) => talk.speakerId))];
  const speakers = await getAll(ctx.db, speakerIds);

  return speakers.filter((speaker) => speaker !== null);
}

export async function enrichCollectionsForAdmin(
  ctx: QueryCtx,
  { collections }: { collections: Doc<'collections'>[] }
) {
  return await asyncMap(collections, async (collection) => {
    const talks = await listTalksForCollection(ctx, {
      collectionId: collection._id,
    });
    const speakers = await loadSpeakersForTalks(ctx, { talks });
    const hasPublishedTalk = talks.some((talk) => talk.status === 'published');

    return {
      collection,
      speakers,
      status: hasPublishedTalk ? ('published' as const) : ('draft' as const),
      talkCount: talks.length,
    };
  });
}

async function filterCollectionsByStatus(
  ctx: QueryCtx,
  {
    collections,
    status,
  }: {
    collections: Doc<'collections'>[];
    status: 'all' | 'draft' | 'published';
  }
) {
  if (status === 'all') {
    return collections;
  }

  const published = await filterCollectionsWithPublishedTalks(ctx, {
    collections,
  });

  if (status === 'published') {
    return published;
  }

  const publishedIds = new Set(published.map((collection) => collection._id));

  return collections.filter((collection) => !publishedIds.has(collection._id));
}

export async function listCollectionsForAdmin(
  ctx: QueryCtx,
  {
    paginationOpts,
    search,
    status,
  }: {
    paginationOpts: PaginationOptions;
    search?: string;
    status: 'all' | 'draft' | 'published';
  }
) {
  const queryText = normalizeSearchQuery(search ?? '');
  const collections =
    queryText.length > 0
      ? await searchCollections(ctx, {
          limit: LIST_SEARCH_LIMIT,
          queryText,
        })
      : await publishedCollectionsQuery(ctx).collect();
  const filtered = await filterCollectionsByStatus(ctx, {
    collections,
    status,
  });
  const result = paginateArray(
    filtered,
    paginationOpts.cursor,
    paginationOpts.numItems
  );

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    page: await enrichCollectionsForAdmin(ctx, { collections: result.page }),
  };
}
