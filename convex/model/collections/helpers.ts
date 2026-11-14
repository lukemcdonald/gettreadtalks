import type { Doc } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { PublishStateFilter } from '../../lib/types';
import type { AdminListPageArgs, SearchArgs } from '../search/helpers';
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
  args: { paginationOpts: PaginationOptions }
) {
  const collectionPages = await publishedCollectionsQuery(ctx).paginate(
    args.paginationOpts
  );

  return {
    ...collectionPages,
    page: await filterCollectionsWithPublishedTalks(ctx, {
      collections: collectionPages.page,
    }),
  };
}

export async function searchCollections(ctx: QueryCtx, args: SearchArgs) {
  return await ctx.db
    .query('collections')
    .withSearchIndex('search_title', (q) => q.search('title', args.queryText))
    .take(args.limit);
}

export async function loadSpeakersForTalks(
  ctx: QueryCtx,
  args: { talks: Doc<'talks'>[] }
) {
  const speakerIds = [...new Set(args.talks.map((talk) => talk.speakerId))];
  const speakers = await getAll(ctx.db, speakerIds);

  return speakers.filter((speaker) => speaker !== null);
}

export async function enrichCollectionsForAdmin(
  ctx: QueryCtx,
  args: { collections: Doc<'collections'>[] }
) {
  return await asyncMap(args.collections, async (collection) => {
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
  args: {
    collections: Doc<'collections'>[];
    status: PublishStateFilter;
  }
) {
  if (args.status === 'all') {
    return args.collections;
  }

  const published = await filterCollectionsWithPublishedTalks(ctx, {
    collections: args.collections,
  });

  if (args.status === 'published') {
    return published;
  }

  const publishedIds = new Set(published.map((collection) => collection._id));

  return args.collections.filter(
    (collection) => !publishedIds.has(collection._id)
  );
}

export async function listCollectionsForAdmin(
  ctx: QueryCtx,
  args: AdminListPageArgs
) {
  const queryText = normalizeSearchQuery(args.search ?? '');
  const collections =
    queryText.length > 0
      ? await searchCollections(ctx, {
          limit: LIST_SEARCH_LIMIT,
          queryText,
        })
      : await publishedCollectionsQuery(ctx).collect();
  const filtered = await filterCollectionsByStatus(ctx, {
    collections,
    status: args.status,
  });
  const result = paginateArray(
    filtered,
    args.paginationOpts.cursor,
    args.paginationOpts.numItems
  );

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    page: await enrichCollectionsForAdmin(ctx, { collections: result.page }),
  };
}
