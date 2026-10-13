import type { Doc } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { PaginationOptions, PaginationResult } from 'convex/server';

import { filterSpeakersWithPublishedTalks } from '../../lib/filters';
import { searchPhrases, uniqueById } from '../search/utils';

const UNFILTERED_SEARCH_MULTIPLIER = 3;

function publishedSpeakersQuery(ctx: QueryCtx) {
  return ctx.db.query('speakers').withIndex('by_lastName').order('asc');
}

export async function listPublishedSpeakers(
  ctx: QueryCtx,
  options: { paginationOpts: PaginationOptions }
): Promise<PaginationResult<Doc<'speakers'>>>;
export async function listPublishedSpeakers(
  ctx: QueryCtx
): Promise<Doc<'speakers'>[]>;
export async function listPublishedSpeakers(
  ctx: QueryCtx,
  options?: { paginationOpts: PaginationOptions }
): Promise<Doc<'speakers'>[] | PaginationResult<Doc<'speakers'>>> {
  const speakersQuery = publishedSpeakersQuery(ctx);

  if (options?.paginationOpts) {
    const result = await speakersQuery.paginate(options.paginationOpts);

    return {
      ...result,
      page: await filterSpeakersWithPublishedTalks(ctx, result.page),
    };
  }

  return await filterSpeakersWithPublishedTalks(
    ctx,
    await speakersQuery.collect()
  );
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
