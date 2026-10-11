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

const DEFAULT_SEARCH_LIMIT = 12;
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

async function searchPublishedTalks(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  const talks = await ctx.db
    .query('talks')
    .withSearchIndex('search_title', (q) =>
      q.search('title', queryText).eq('status', 'published')
    )
    .take(limit);
  const talksWithSpeakers = await enrichWithSpeakers(ctx, talks);

  return talksWithSpeakers.map((talk) => ({
    _id: talk._id,
    description: talk.description,
    slug: talk.slug,
    speaker: toSearchSpeaker(talk.speaker),
    title: talk.title,
  }));
}

async function searchPublishedSpeakers(
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

  return speakers.slice(0, limit).map((speaker) => ({
    _id: speaker._id,
    firstName: speaker.firstName,
    lastName: speaker.lastName,
    ministry: speaker.ministry,
    slug: speaker.slug,
  }));
}

async function searchPublishedTopics(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  const topics = await ctx.db
    .query('topics')
    .withSearchIndex('search_title', (q) => q.search('title', queryText))
    .take(limit * UNFILTERED_SEARCH_MULTIPLIER);
  const published = await filterTopicsWithPublishedTalks(ctx, topics);

  return published.slice(0, limit).map((topic) => ({
    _id: topic._id,
    slug: topic.slug,
    title: topic.title,
  }));
}

async function searchPublishedClips(
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
  const limited = clips.slice(0, limit);

  return await Promise.all(
    limited.map(async (clip) => {
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
      clips,
      speakers,
      talks,
      topics,
    };
  },
  returns: v.object({
    clips: v.array(searchClipValidator),
    speakers: v.array(searchSpeakerResultValidator),
    talks: v.array(searchTalkValidator),
    topics: v.array(searchTopicValidator),
  }),
});
