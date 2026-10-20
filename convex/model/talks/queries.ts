import type { Doc } from '../../_generated/dataModel';
import type { ContentSortOption } from '../../lib/sort';

import {
  getManyFrom,
  getManyVia,
  getOneFrom,
} from 'convex-helpers/server/relationships';
import {
  paginationOptsValidator,
  paginationResultValidator,
} from 'convex/server';
import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { getTalkIdsByTopicSlugs } from '../../lib/filters';
import { rotateContent } from '../../lib/rotateContent';
import { getContentComparator } from '../../lib/sort';
import { enrichWithSpeaker, paginateArray } from '../../lib/utils';
import { talkWithSpeakerValidator } from '../../lib/validators/query';
import { doc, docs } from '../../lib/validators/schema';
import { statusFilterType } from '../../lib/validators/shared';
import { canViewContent, requireAdmin } from '../auth/roles';
import { getCurrentUser } from '../auth/utils';
import { LIST_SEARCH_LIMIT } from '../search/constants';
import { normalizeSearchQuery } from '../search/utils';
import {
  listPublishedTalks,
  listPublishedTalksForTopics,
  listPublishedTalksPage,
  searchPublishedTalksByTitleOrSpeaker,
} from './helpers';
import { talkTranscriptFields } from './schema';
import {
  enrichAdminTalks,
  enrichWithTopics,
  filterTalksByTitleOrSpeaker,
} from './utils';

/**
 * List slugs for published talks with their speaker slugs.
 */
export const listTalkSlugs = query({
  args: {},
  handler: async (ctx) => {
    const talks = await enrichWithSpeaker(ctx, await listPublishedTalks(ctx));

    return talks.flatMap((talk) => {
      if (!talk.speaker) {
        return [];
      }

      return [
        {
          speakerSlug: talk.speaker.slug,
          talkSlug: talk.slug,
          updatedAt: talk.updatedAt ?? talk._creationTime,
        },
      ];
    });
  },
  returns: v.array(
    v.object({
      speakerSlug: v.string(),
      talkSlug: v.string(),
      updatedAt: v.number(),
    })
  ),
});

/**
 * Get talk by ID.
 */
export const getTalk = query({
  args: {
    id: v.id('talks'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await ctx.db.get('talks', args.id);
  },
  returns: doc('talks').nullable(),
});

/**
 * List topics assigned to a talk.
 */
export const listTalkTopics = query({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const topics = await getManyVia(
      ctx.db,
      'talksOnTopics',
      'topicId',
      'by_talkId',
      args.talkId,
      'talkId'
    );

    return topics.filter((topic): topic is Doc<'topics'> => topic !== null);
  },
  returns: docs('topics'),
});

/**
 * Get talk by speaker slug and talk slug with related data (default for detail pages).
 * Returns talk with speaker, collection, clips, and topics.
 */
export const getTalkBySlug = query({
  args: {
    speakerSlug: v.string(),
    talkSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    // First, get the speaker by slug
    const speaker = await getOneFrom(
      ctx.db,
      'speakers',
      'by_slug',
      args.speakerSlug
    );

    if (!speaker) {
      return null;
    }

    // Then, find the talk with the given slug for this speaker
    const talks = await ctx.db
      .query('talks')
      .withIndex('by_speakerId_and_status', (q) =>
        q.eq('speakerId', speaker._id)
      )
      .collect();

    const talk = talks.find((t) => t.slug === args.talkSlug);

    if (!talk) {
      return null;
    }

    if (!canViewContent(user, talk.status)) {
      return null;
    }

    const queries = {
      clips: ctx.db
        .query('clips')
        .withIndex('by_talkId_and_status', (q) =>
          q.eq('talkId', talk._id).eq('status', 'published')
        )
        .collect(),
      collection: talk.collectionId
        ? ctx.db.get('collections', talk.collectionId)
        : null,
      topics: getManyVia(
        ctx.db,
        'talksOnTopics',
        'topicId',
        'by_talkId',
        talk._id,
        'talkId'
      ),
    };

    const [clips, collection, topics] = await Promise.all([
      queries.clips,
      queries.collection,
      queries.topics,
    ]);

    const validTopics = topics.filter((topic) => topic !== null);

    return {
      clips,
      collection,
      speaker,
      talk,
      topics: validTopics,
    };
  },
  returns: v.nullable(
    v.object({
      clips: docs('clips'),
      collection: doc('collections').nullable(),
      speaker: doc('speakers').nullable(),
      talk: doc('talks'),
      topics: docs('topics'),
    })
  ),
});

/**
 * Get total count of published talks.
 */
export const getTalksCount = query({
  args: {},
  handler: async (ctx) => {
    const talks = await getManyFrom(
      ctx.db,
      'talks',
      'by_status_and_publishedAt',
      'published',
      'status'
    );

    return talks.length;
  },
  returns: v.number(),
});

/**
 * Get featured talks with daily rotation.
 */
export const listFeaturedTalksWithSpeakers = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 5 } = args;

    const talks = await ctx.db
      .query('talks')
      .withIndex('by_featured_and_status', (q) =>
        q.eq('featured', true).eq('status', 'published')
      )
      .take(50);

    const page = rotateContent(talks, { count: limit, period: 'daily' });

    return await enrichWithSpeaker(ctx, page);
  },
  returns: v.array(talkWithSpeakerValidator),
});

/**
 * Get rotated talks by speaker with daily rotation.
 */
export const listRandomTalksBySpeaker = query({
  args: {
    excludeTalkId: v.optional(v.string()),
    limit: v.optional(v.number()),
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    const { excludeTalkId, limit = 5, speakerId } = args;

    const talks = await ctx.db
      .query('talks')
      .withIndex('by_speakerId_and_status', (q) =>
        q.eq('speakerId', speakerId).eq('status', 'published')
      )
      .collect();

    const filteredTalks = excludeTalkId
      ? talks.filter((talk) => talk._id !== excludeTalkId)
      : talks;

    return rotateContent(filteredTalks, { count: limit, period: 'daily' });
  },
  returns: docs('talks'),
});

/**
 * Get talks by collection with status filter. Returns talks sorted by collection order.
 */
export const listTalksByCollection = query({
  args: {
    collectionId: v.id('collections'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { collectionId, limit = 100 } = args;

    const talks = await ctx.db
      .query('talks')
      .withIndex('by_collectionId_and_status', (q) =>
        q.eq('collectionId', collectionId).eq('status', 'published')
      )
      .take(limit);

    const sortedTalks = talks.toSorted(
      (a, b) => (a.collectionOrder || 0) - (b.collectionOrder || 0)
    );

    return sortedTalks;
  },
  returns: docs('talks'),
});

/**
 * Get talks by speaker with status filter.
 */
export const listTalksBySpeaker = query({
  args: {
    limit: v.optional(v.number()),
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    const { limit = 20, speakerId } = args;

    return await ctx.db
      .query('talks')
      .withIndex('by_speakerId_and_status', (q) =>
        q.eq('speakerId', speakerId).eq('status', 'published')
      )
      .order('desc')
      .take(limit);
  },
  returns: docs('talks'),
});

/**
 * List published talks that share any of the given topics.
 */
export const listTalksByTopics = query({
  args: {
    excludeTalkIds: v.optional(v.array(v.id('talks'))),
    limit: v.optional(v.number()),
    topicIds: v.array(v.id('topics')),
  },
  handler: async (ctx, args) => {
    const { excludeTalkIds = [], limit = 4, topicIds } = args;
    const talks = await listPublishedTalksForTopics(ctx, topicIds, {
      excludeTalkIds,
    });
    const page = rotateContent(talks, { count: limit, period: 'daily' });

    return await enrichWithSpeaker(ctx, page);
  },
  returns: v.array(talkWithSpeakerValidator),
});

const sortType = v.optional(
  v.union(
    v.literal('alphabetical'),
    v.literal('featured'),
    v.literal('oldest'),
    v.literal('recent')
  )
);

/**
 * List published talks with speaker data, optional filtering, and sorting.
 * Defaults to 50 items per page, sorted by most recent.
 */
export const listTalks = query({
  args: {
    featured: v.optional(v.boolean()),
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    sort: sortType,
    speakerSlugs: v.optional(v.array(v.string())),
    topicSlugs: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const {
      featured,
      paginationOpts,
      search,
      sort = 'recent',
      speakerSlugs,
      topicSlugs,
    } = args;

    const queryText = normalizeSearchQuery(search ?? '');
    const hasSearch = queryText.length > 0;
    const hasSpeakerFilter = speakerSlugs && speakerSlugs.length > 0;
    const hasTopicFilter = topicSlugs && topicSlugs.length > 0;
    const hasFilters =
      hasSearch || hasSpeakerFilter || hasTopicFilter || featured;
    const needsCustomSort = sort !== 'recent';

    // When no filters and default sort, use native Convex pagination for efficiency
    if (!(hasFilters || needsCustomSort)) {
      const result = await listPublishedTalksPage(ctx, paginationOpts);
      const talksWithSpeakers = await enrichWithSpeaker(ctx, result.page);
      const enrichedTalks = await enrichWithTopics(ctx, talksWithSpeakers);

      return {
        ...result,
        page: enrichedTalks,
      };
    }

    let talks = hasSearch
      ? await searchPublishedTalksByTitleOrSpeaker(
          ctx,
          queryText,
          LIST_SEARCH_LIMIT
        )
      : await listPublishedTalks(ctx);

    // Apply speaker filter (multi-select)
    if (hasSpeakerFilter) {
      const speakers = await Promise.all(
        speakerSlugs.map((slug) =>
          getOneFrom(ctx.db, 'speakers', 'by_slug', slug)
        )
      );
      const validSpeakers = speakers.filter(
        (s): s is NonNullable<typeof s> => s !== null
      );
      const speakerIds = new Set(validSpeakers.map((s) => s._id));

      // No matching speakers found
      talks =
        speakerIds.size > 0
          ? talks.filter((talk) => speakerIds.has(talk.speakerId))
          : [];
    }

    // Apply topic filter (multi-select)
    if (hasTopicFilter) {
      const topicTalkIds = await getTalkIdsByTopicSlugs(ctx, topicSlugs);

      // No matching topics found
      talks = topicTalkIds
        ? talks.filter((talk) => topicTalkIds.has(talk._id))
        : [];
    }

    // Apply featured filter
    if (featured) {
      talks = talks.filter((talk) => talk.featured);
    }

    // Apply sorting
    talks.sort(getContentComparator(sort as ContentSortOption));

    const { continueCursor, isDone, page } = paginateArray(
      talks,
      paginationOpts.cursor,
      paginationOpts.numItems
    );

    const talksWithSpeakers = await enrichWithSpeaker(ctx, page);
    const enrichedTalks = await enrichWithTopics(ctx, talksWithSpeakers);

    return {
      continueCursor,
      isDone,
      page: enrichedTalks,
    };
  },
  returns: paginationResultValidator(
    talkWithSpeakerValidator.extend({
      topicSlugs: v.array(v.string()),
    })
  ),
});

/**
 * List all talks with speaker data and filtering support.
 * Use status='all' to fetch across all statuses, defaults to 'published'.
 */
export const listAllTalks = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    status: v.optional(statusFilterType),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const { paginationOpts, search, status = 'published' } = args;

    // Search requires in-memory filtering, can't use .paginate()
    const talks: Doc<'talks'>[] =
      status === 'all'
        ? await ctx.db.query('talks').order('desc').collect()
        : await ctx.db
            .query('talks')
            .withIndex('by_status_and_publishedAt', (q) =>
              q.eq('status', status)
            )
            .order('desc')
            .collect();

    if (search) {
      const matchingTalks = await filterTalksByTitleOrSpeaker(
        ctx,
        search,
        talks
      );
      const { continueCursor, isDone, page } = paginateArray(
        matchingTalks,
        paginationOpts.cursor,
        paginationOpts.numItems
      );
      return {
        continueCursor,
        isDone,
        page: await enrichAdminTalks(ctx, page),
      };
    }

    const { continueCursor, isDone, page } = paginateArray(
      talks,
      paginationOpts.cursor,
      paginationOpts.numItems
    );

    return {
      continueCursor,
      isDone,
      page: await enrichAdminTalks(ctx, page),
    };
  },
  returns: paginationResultValidator(
    v.object({
      ...doc('talks').fields,
      collectionTitle: v.union(v.null(), v.string()),
      featuredClipTitle: v.union(v.null(), v.string()),
      speaker: doc('speakers').nullable(),
      topicSlugs: v.array(v.string()),
    })
  ),
});

const { text: _talkTranscriptText, ...talkTranscriptListFields } =
  talkTranscriptFields;

const talkTranscriptListItem = v.object({
  _creationTime: v.number(),
  _id: v.id('talkTranscripts'),
  ...talkTranscriptListFields,
});

/**
 * List published (or filtered) talks that have no transcript row.
 */
export const listTalksWithoutTranscript = query({
  args: {
    status: v.optional(statusFilterType),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const status = args.status ?? 'published';
    const talks =
      status === 'all'
        ? await ctx.db.query('talks').order('desc').collect()
        : await ctx.db
            .query('talks')
            .withIndex('by_status_and_publishedAt', (q) =>
              q.eq('status', status)
            )
            .order('desc')
            .collect();
    const transcripts = await ctx.db.query('talkTranscripts').collect();
    const talkIdsWithTranscript = new Set(
      transcripts.map((transcript) => transcript.talkId)
    );

    return talks.filter((talk) => !talkIdsWithTranscript.has(talk._id));
  },
  returns: docs('talks'),
});

/**
 * List transcript metadata. Omits transcript text.
 */
export const listTalkTranscripts = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const transcripts = await ctx.db.query('talkTranscripts').collect();

    return transcripts.map(({ text: _text, ...item }) => item);
  },
  returns: v.array(talkTranscriptListItem),
});

/**
 * List study rows still awaiting review.
 */
export const listDraftTalkStudies = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    return await ctx.db
      .query('talkStudies')
      .withIndex('by_studyStatus', (q) => q.eq('studyStatus', 'draft'))
      .collect();
  },
  returns: docs('talkStudies'),
});

/**
 * Get the study for a talk. Admin only.
 */
export const getTalkStudy = query({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await ctx.db
      .query('talkStudies')
      .withIndex('by_talkId', (q) => q.eq('talkId', args.talkId))
      .unique();
  },
  returns: doc('talkStudies').nullable(),
});

/**
 * Get the private transcript for a talk, including text. Admin only.
 */
export const getTalkTranscript = query({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await ctx.db
      .query('talkTranscripts')
      .withIndex('by_talkId', (q) => q.eq('talkId', args.talkId))
      .unique();
  },
  returns: doc('talkTranscripts').nullable(),
});
