import type { QueryCtx } from '../../_generated/server';
import type { PaginationOptions } from 'convex/server';

import { filterSpeakersWithPublishedTalks } from '../../lib/filters';
import { searchPhrases, uniqueById } from '../search/utils';

const UNFILTERED_SEARCH_MULTIPLIER = 3;

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
  const result = await publishedSpeakersQuery(ctx).paginate(paginationOpts);

  return {
    ...result,
    page: await filterSpeakersWithPublishedTalks(ctx, result.page),
  };
}

export async function searchPublishedSpeakers(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  const candidateLimit = limit * UNFILTERED_SEARCH_MULTIPLIER;
  const phrases = searchPhrases(queryText);
  const matches = await Promise.all([
    ...phrases.map((phrase) =>
      ctx.db
        .query('speakers')
        .withSearchIndex('search_firstName', (q) =>
          q.search('firstName', phrase)
        )
        .take(candidateLimit)
    ),
    ...phrases.map((phrase) =>
      ctx.db
        .query('speakers')
        .withSearchIndex('search_lastName', (q) => q.search('lastName', phrase))
        .take(candidateLimit)
    ),
  ]);

  const speakers = await filterSpeakersWithPublishedTalks(
    ctx,
    uniqueById(matches.flat())
  );

  return speakers.slice(0, limit);
}
