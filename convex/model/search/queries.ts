import type { Doc } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';

import { v } from 'convex/values';

import { query } from '../../_generated/server';
import {
  filterClipsByPublishedTalks,
  filterSpeakersWithPublishedTalks,
  filterTopicsWithPublishedTalks,
} from '../../lib/filters';
import { enrichWithSpeakers } from '../../lib/utils';
import { normalizeSearchQuery, searchPhrases, uniqueById } from './utils';

export const DEFAULT_SEARCH_LIMIT = 12;
export const LIST_SEARCH_LIMIT = 100;

const UNFILTERED_SEARCH_MULTIPLIER = 3;

const searchSpeakerValidator = v.object({
  firstName: v.string(),
  lastName: v.string(),
  slug: v.string(),
});

const searchClipValidator = v.object({
  _id: v.id('clips'),
  description: v.optional(v.string()),
  slug: v.string(),
  speaker: v.nullable(searchSpeakerValidator),
  title: v.string(),
});

const searchSpeakerResultValidator = v.object({
  _id: v.id('speakers'),
  firstName: v.string(),
  lastName: v.string(),
  ministry: v.optional(v.string()),
  slug: v.string(),
});

const searchTalkValidator = v.object({
  _id: v.id('talks'),
  description: v.optional(v.string()),
  slug: v.string(),
  speaker: v.nullable(searchSpeakerValidator),
  title: v.string(),
});

const searchTopicValidator = v.object({
  _id: v.id('topics'),
  slug: v.string(),
  title: v.string(),
});

export const emptySiteSearch = {
  clips: [],
  speakers: [],
  talks: [],
  topics: [],
};

function toSearchSpeaker(speaker: Doc<'speakers'> | null) {
  if (!speaker) {
    return null;
  }

  return {
    firstName: speaker.firstName,
    lastName: speaker.lastName,
    slug: speaker.slug,
  };
}

async function toSearchTalks(ctx: QueryCtx, talks: Doc<'talks'>[]) {
  const talksWithSpeakers = await enrichWithSpeakers(ctx, talks);

  return talksWithSpeakers.map((talk) => ({
    _id: talk._id,
    description: talk.description,
    slug: talk.slug,
    speaker: toSearchSpeaker(talk.speaker),
    title: talk.title,
  }));
}

async function toSearchClips(ctx: QueryCtx, clips: Doc<'clips'>[]) {
  return await Promise.all(
    clips.map(async (clip) => {
      const speaker = clip.speakerId
        ? await ctx.db.get('speakers', clip.speakerId)
        : null;

      return {
        _id: clip._id,
        description: clip.description,
        slug: clip.slug,
        speaker: toSearchSpeaker(speaker),
        title: clip.title,
      };
    })
  );
}

export async function searchPublishedTalks(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  return await ctx.db
    .query('talks')
    .withSearchIndex('search_title', (q) =>
      q.search('title', queryText).eq('status', 'published')
    )
    .take(limit);
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

export async function searchPublishedTopics(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  const topics = await ctx.db
    .query('topics')
    .withSearchIndex('search_title', (q) => q.search('title', queryText))
    .take(limit * UNFILTERED_SEARCH_MULTIPLIER);
  const published = await filterTopicsWithPublishedTalks(ctx, topics);

  return published.slice(0, limit);
}

export async function searchPublishedClips(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  const clips = await filterClipsByPublishedTalks(
    ctx,
    await ctx.db
      .query('clips')
      .withSearchIndex('search_title', (q) =>
        q.search('title', queryText).eq('status', 'published')
      )
      .take(limit)
  );

  return clips.slice(0, limit);
}

/** Title matches plus published talks by speakers whose names match. */
export async function searchPublishedTalksByTitleOrSpeaker(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  const [titleHits, speakers] = await Promise.all([
    searchPublishedTalks(ctx, queryText, limit),
    searchPublishedSpeakers(ctx, queryText, DEFAULT_SEARCH_LIMIT),
  ]);

  if (speakers.length === 0) {
    return titleHits;
  }

  const speakerTalkPages = await Promise.all(
    speakers.map((speaker) =>
      ctx.db
        .query('talks')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speaker._id).eq('status', 'published')
        )
        .take(limit)
    )
  );

  return uniqueById<Doc<'talks'>>([
    ...titleHits,
    ...speakerTalkPages.flat(),
  ]).slice(0, limit);
}

export const searchSite = query({
  args: {
    limit: v.optional(v.number()),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const queryText = normalizeSearchQuery(args.query);

    if (!queryText) {
      return emptySiteSearch;
    }

    const limit = args.limit ?? DEFAULT_SEARCH_LIMIT;
    const [clips, speakers, talks, topics] = await Promise.all([
      searchPublishedClips(ctx, queryText, limit),
      searchPublishedSpeakers(ctx, queryText, limit),
      searchPublishedTalks(ctx, queryText, limit),
      searchPublishedTopics(ctx, queryText, limit),
    ]);

    return {
      clips: await toSearchClips(ctx, clips),
      speakers: speakers.map((speaker) => ({
        _id: speaker._id,
        firstName: speaker.firstName,
        lastName: speaker.lastName,
        ministry: speaker.ministry,
        slug: speaker.slug,
      })),
      talks: await toSearchTalks(ctx, talks),
      topics: topics.map((topic) => ({
        _id: topic._id,
        slug: topic.slug,
        title: topic.title,
      })),
    };
  },
  returns: v.object({
    clips: v.array(searchClipValidator),
    speakers: v.array(searchSpeakerResultValidator),
    talks: v.array(searchTalkValidator),
    topics: v.array(searchTopicValidator),
  }),
});
