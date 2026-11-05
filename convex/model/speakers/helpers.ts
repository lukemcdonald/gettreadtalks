import type { Doc } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
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
  return await filterSpeakersWithPublicContent(
    ctx,
    await publishedSpeakersQuery(ctx).collect()
  );
}

export async function listPublishedSpeakersPage(
  ctx: QueryCtx,
  paginationOpts: PaginationOptions
) {
  const result = await publishedSpeakersQuery(ctx).paginate(paginationOpts);

  return {
    ...result,
    page: await filterSpeakersWithPublicContent(ctx, result.page),
  };
}

async function searchSpeakerDocuments(
  ctx: QueryCtx,
  queryText: string,
  take: number
) {
  const phrases = searchPhrases(queryText);
  const matches = await Promise.all([
    ...phrases.map((phrase) =>
      ctx.db
        .query('speakers')
        .withSearchIndex('search_firstName', (q) =>
          q.search('firstName', phrase)
        )
        .take(take)
    ),
    ...phrases.map((phrase) =>
      ctx.db
        .query('speakers')
        .withSearchIndex('search_lastName', (q) => q.search('lastName', phrase))
        .take(take)
    ),
  ]);

  return uniqueById(matches.flat());
}

export async function searchSpeakers(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  const speakers = await searchSpeakerDocuments(ctx, queryText, limit);

  return speakers.slice(0, limit);
}

export async function searchPublishedSpeakers(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  const speakers = await filterSpeakersWithPublicContent(
    ctx,
    await searchSpeakerDocuments(
      ctx,
      queryText,
      limit * UNFILTERED_SEARCH_MULTIPLIER
    )
  );

  return speakers.slice(0, limit);
}

export async function enrichSpeakersForAdmin(
  ctx: QueryCtx,
  speakers: Doc<'speakers'>[]
) {
  return await asyncMap(speakers, async (speaker) => {
    const [clips, publishedSpeakers, talks] = await Promise.all([
      getManyFrom(ctx.db, 'clips', 'by_speakerId', speaker._id),
      filterSpeakersWithPublicContent(ctx, [speaker]),
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
  speakers: Doc<'speakers'>[],
  status: 'all' | 'draft' | 'published'
) {
  if (status === 'all') {
    return speakers;
  }

  const published = await filterSpeakersWithPublicContent(ctx, speakers);

  if (status === 'published') {
    return published;
  }

  const publishedIds = new Set(published.map((speaker) => speaker._id));

  return speakers.filter((speaker) => !publishedIds.has(speaker._id));
}

export async function listSpeakersForAdmin(
  ctx: QueryCtx,
  options: {
    paginationOpts: PaginationOptions;
    search?: string;
    status: 'all' | 'draft' | 'published';
  }
) {
  const queryText = normalizeSearchQuery(options.search ?? '');
  const speakers =
    queryText.length > 0
      ? await searchSpeakers(ctx, queryText, LIST_SEARCH_LIMIT)
      : await publishedSpeakersQuery(ctx).collect();
  const filtered = await filterSpeakersByStatus(ctx, speakers, options.status);
  const result = paginateArray(
    filtered,
    options.paginationOpts.cursor,
    options.paginationOpts.numItems
  );

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    page: await enrichSpeakersForAdmin(ctx, result.page),
  };
}
