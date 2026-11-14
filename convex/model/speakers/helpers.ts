import type { Doc } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { PublishStateFilter } from '../../lib/types';
import type { AdminListPageArgs, SearchArgs } from '../search/helpers';
import type { PaginationOptions } from 'convex/server';

import { asyncMap } from 'convex-helpers';
import { getManyFrom } from 'convex-helpers/server/relationships';

import { filterSpeakersWithPublicContent } from '../../lib/filters';
import { paginateArray } from '../../lib/utils';
import {
  LIST_SEARCH_LIMIT,
  normalizeSearchQuery,
  searchPhrases,
  uniqueById,
} from '../search/helpers';

const UNFILTERED_SEARCH_MULTIPLIER = 3;

function publishedSpeakersQuery(ctx: QueryCtx) {
  return ctx.db.query('speakers').withIndex('by_lastName').order('asc');
}

export async function listPublishedSpeakers(ctx: QueryCtx) {
  return await filterSpeakersWithPublicContent(ctx, {
    speakers: await publishedSpeakersQuery(ctx).collect(),
  });
}

export async function listPublishedSpeakersPage(
  ctx: QueryCtx,
  args: { paginationOpts: PaginationOptions }
) {
  const result = await publishedSpeakersQuery(ctx).paginate(
    args.paginationOpts
  );

  return {
    ...result,
    page: await filterSpeakersWithPublicContent(ctx, { speakers: result.page }),
  };
}

async function searchSpeakerDocuments(
  ctx: QueryCtx,
  args: {
    queryText: string;
    take: number;
  }
) {
  const phrases = searchPhrases(args.queryText);
  const matches = await Promise.all([
    ...phrases.map((phrase) =>
      ctx.db
        .query('speakers')
        .withSearchIndex('search_firstName', (q) =>
          q.search('firstName', phrase)
        )
        .take(args.take)
    ),
    ...phrases.map((phrase) =>
      ctx.db
        .query('speakers')
        .withSearchIndex('search_lastName', (q) => q.search('lastName', phrase))
        .take(args.take)
    ),
  ]);

  return uniqueById(matches.flat());
}

export async function searchSpeakers(ctx: QueryCtx, args: SearchArgs) {
  const speakers = await searchSpeakerDocuments(ctx, {
    queryText: args.queryText,
    take: args.limit,
  });

  return speakers.slice(0, args.limit);
}

export async function searchPublishedSpeakers(ctx: QueryCtx, args: SearchArgs) {
  const speakers = await filterSpeakersWithPublicContent(ctx, {
    speakers: await searchSpeakerDocuments(ctx, {
      queryText: args.queryText,
      take: args.limit * UNFILTERED_SEARCH_MULTIPLIER,
    }),
  });

  return speakers.slice(0, args.limit);
}

export async function enrichSpeakersForAdmin(
  ctx: QueryCtx,
  args: { speakers: Doc<'speakers'>[] }
) {
  return await asyncMap(args.speakers, async (speaker) => {
    const [clips, publishedSpeakers, talks] = await Promise.all([
      getManyFrom(ctx.db, 'clips', 'by_speakerId', speaker._id),
      filterSpeakersWithPublicContent(ctx, { speakers: [speaker] }),
      ctx.db
        .query('talks')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speaker._id)
        )
        .collect(),
    ]);
    const hasPublishedContent = publishedSpeakers.length > 0;

    return {
      clipCount: clips.length,
      speaker,
      status: hasPublishedContent ? ('published' as const) : ('draft' as const),
      talkCount: talks.length,
    };
  });
}

async function filterSpeakersByStatus(
  ctx: QueryCtx,
  args: {
    speakers: Doc<'speakers'>[];
    status: PublishStateFilter;
  }
) {
  if (args.status === 'all') {
    return args.speakers;
  }

  const published = await filterSpeakersWithPublicContent(ctx, {
    speakers: args.speakers,
  });

  if (args.status === 'published') {
    return published;
  }

  const publishedIds = new Set(published.map((speaker) => speaker._id));

  return args.speakers.filter((speaker) => !publishedIds.has(speaker._id));
}

export async function listSpeakersForAdmin(
  ctx: QueryCtx,
  args: AdminListPageArgs
) {
  const queryText = normalizeSearchQuery(args.search ?? '');
  const speakers =
    queryText.length > 0
      ? await searchSpeakers(ctx, {
          limit: LIST_SEARCH_LIMIT,
          queryText,
        })
      : await publishedSpeakersQuery(ctx).collect();
  const filtered = await filterSpeakersByStatus(ctx, {
    speakers,
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
    page: await enrichSpeakersForAdmin(ctx, { speakers: result.page }),
  };
}
