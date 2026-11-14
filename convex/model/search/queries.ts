import type { Doc } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';

import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { enrichWithSpeaker } from '../../lib/utils';
import { enrichClipsWithSpeaker, searchPublishedClips } from '../clips/helpers';
import { searchPublishedSpeakers } from '../speakers/helpers';
import { searchPublishedTalksByTitleOrSpeaker } from '../talks/helpers';
import { searchPublishedTopics } from '../topics/helpers';
import { normalizeSearchLimit, normalizeSearchQuery } from './helpers';

const searchResultSpeakerValidator = v.object({
  firstName: v.string(),
  lastName: v.string(),
  slug: v.string(),
});

const searchClipValidator = v.object({
  _id: v.id('clips'),
  description: v.optional(v.string()),
  slug: v.string(),
  speaker: v.nullable(searchResultSpeakerValidator),
  title: v.string(),
});

const searchSpeakerValidator = v.object({
  _id: v.id('speakers'),
  firstName: v.string(),
  lastName: v.string(),
  ministry: v.optional(v.string()),
  slug: v.string(),
});

const searchTalkValidator = v.object({
  _id: v.id('talks'),
  scripture: v.optional(v.string()),
  slug: v.string(),
  speaker: v.nullable(searchResultSpeakerValidator),
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

async function toSearchTalks(
  ctx: QueryCtx,
  { talks }: { talks: Doc<'talks'>[] }
) {
  const talksWithSpeakers = await enrichWithSpeaker(ctx, { items: talks });

  return talksWithSpeakers.flatMap((talk) => {
    const speaker = toSearchSpeaker(talk.speaker);

    if (!speaker) {
      return [];
    }

    return [
      {
        _id: talk._id,
        scripture: talk.scripture,
        slug: talk.slug,
        speaker,
        title: talk.title,
      },
    ];
  });
}

async function toSearchClips(
  ctx: QueryCtx,
  { clips }: { clips: Doc<'clips'>[] }
) {
  const clipsWithSpeakers = await enrichClipsWithSpeaker(ctx, { items: clips });

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

    const limit = normalizeSearchLimit(args.limit);
    const [clips, speakers, talks, topics] = await Promise.all([
      searchPublishedClips(ctx, {
        limit,
        queryText,
      }),
      searchPublishedSpeakers(ctx, {
        limit,
        queryText,
      }),
      searchPublishedTalksByTitleOrSpeaker(ctx, {
        limit,
        queryText,
      }),
      searchPublishedTopics(ctx, {
        limit,
        queryText,
      }),
    ]);

    return {
      clips: await toSearchClips(ctx, { clips }),
      speakers: speakers.map((speaker) => ({
        _id: speaker._id,
        firstName: speaker.firstName,
        lastName: speaker.lastName,
        ministry: speaker.ministry,
        slug: speaker.slug,
      })),
      talks: await toSearchTalks(ctx, { talks }),
      topics: topics.map((topic) => ({
        _id: topic._id,
        slug: topic.slug,
        title: topic.title,
      })),
    };
  },
  returns: v.object({
    clips: v.array(searchClipValidator),
    speakers: v.array(searchSpeakerValidator),
    talks: v.array(searchTalkValidator),
    topics: v.array(searchTopicValidator),
  }),
});
