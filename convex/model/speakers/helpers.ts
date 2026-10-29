import type { Doc } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { PaginationOptions } from 'convex/server';

import { asyncMap } from 'convex-helpers';
import { getManyFrom } from 'convex-helpers/server/relationships';

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
