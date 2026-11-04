import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { PaginationOptions } from 'convex/server';

import { asyncMap } from 'convex-helpers';
import { getManyFrom, getOneFrom } from 'convex-helpers/server/relationships';

import { filterSpeakersWithPublishedTalks } from '../../lib/filters';
import { paginateArray, loadFullPage } from '../../lib/utils';
import {
  LIST_SEARCH_LIMIT,
  normalizeSearchQuery,
  searchPhrases,
  uniqueById,
} from '../search/helpers';

const UNFILTERED_SEARCH_MULTIPLIER = 3;

export async function loadSpeakerIdsBySlugs(
  ctx: QueryCtx,
  slugs: string[]
): Promise<Set<Id<'speakers'>>> {
  const speakers = await Promise.all(
    slugs.map((slug) => getOneFrom(ctx.db, 'speakers', 'by_slug', slug))
  );

  return new Set(speakers.flatMap((speaker) => (speaker ? [speaker._id] : [])));
}

function publishedSpeakersQuery(ctx: QueryCtx) {
  return ctx.db.query('speakers').withIndex('by_lastName').order('asc');
}

export async function listPublishedSpeakers(ctx: QueryCtx) {
  return await filterSpeakersWithPublishedTalks(
    ctx,
    await publishedSpeakersQuery(ctx).collect()
  );
}

export async function listPublishedSpeakersPage(
  ctx: QueryCtx,
  paginationOpts: PaginationOptions
) {
  return await loadFullPage(
    (opts) => publishedSpeakersQuery(ctx).paginate(opts),
    (speakers) => filterSpeakersWithPublishedTalks(ctx, speakers),
    paginationOpts
  );
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
  const speakers = await filterSpeakersWithPublishedTalks(
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
    const talks = await ctx.db
      .query('talks')
      .withIndex('by_speakerId_and_status', (q) =>
        q.eq('speakerId', speaker._id)
      )
      .collect();
    const clips = await getManyFrom(
      ctx.db,
      'clips',
      'by_speakerId',
      speaker._id
    );
    const hasPublishedContent =
      talks.some((talk) => talk.status === 'published') ||
      clips.some((clip) => clip.status === 'published');

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

  const published = await filterSpeakersWithPublishedTalks(ctx, speakers);

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
