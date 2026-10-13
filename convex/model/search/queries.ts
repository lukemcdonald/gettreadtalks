import type { Doc } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';

import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { enrichWithSpeaker } from '../../lib/utils';
import { enrichClipsWithSpeaker, searchPublishedClips } from '../clips/helpers';
import { searchPublishedSpeakers } from '../speakers/helpers';
import { searchPublishedTalks } from '../talks/helpers';
import { searchPublishedTopics } from '../topics/helpers';
import { DEFAULT_SEARCH_LIMIT } from './constants';
import { normalizeSearchQuery } from './utils';

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
  const talksWithSpeakers = await enrichWithSpeaker(ctx, talks);

  return talksWithSpeakers.map((talk) => ({
    _id: talk._id,
    description: talk.description,
    slug: talk.slug,
    speaker: toSearchSpeaker(talk.speaker),
    title: talk.title,
  }));
}

async function toSearchClips(ctx: QueryCtx, clips: Doc<'clips'>[]) {
  const clipsWithSpeakers = await enrichClipsWithSpeaker(ctx, clips);

  return clipsWithSpeakers.map((clip) => ({
    _id: clip._id,
    description: clip.description,
    slug: clip.slug,
    speaker: toSearchSpeaker(clip.speaker),
    title: clip.title,
  }));
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
