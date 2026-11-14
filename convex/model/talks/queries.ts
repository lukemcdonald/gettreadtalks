import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { ContentSortOption } from '../../lib/sort';
import type { StatusFilterType } from '../../lib/types';
import type { talkStudyStatus } from './validators';
import type { PaginationOptions } from 'convex/server';
import type { Infer } from 'convex/values';

import { getManyVia, getOneFrom } from 'convex-helpers/server/relationships';
import {
  paginationOptsValidator,
  paginationResultValidator,
} from 'convex/server';
import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { getTalkIdsByTopicSlugs } from '../../lib/filters';
import { rotateContent } from '../../lib/rotateContent';
import { byPublishedAt, getContentComparator } from '../../lib/sort';
import {
  enrichWithSpeaker,
  paginateArray,
  toPublicTalk,
} from '../../lib/utils';
import { talkWithSpeakerValidator } from '../../lib/validators/query';
import { doc, docs } from '../../lib/validators/schema';
import { statusFilterType } from '../../lib/validators/shared';
import { canViewContent, loadCurrentUser, requireAdmin } from '../auth/helpers';
import {
  LIST_SEARCH_LIMIT,
  listAllAdmin,
  normalizeSearchQuery,
} from '../search/helpers';
import { loadTalkFeature } from '../talkFeatures/helpers';
import {
  enrichTalksForAdmin,
  enrichWithTopics,
  listPublishedTalks,
  listPublishedTalksForTopics,
  listPublishedTalksPage,
  searchPublishedTalksByTitleOrSpeaker,
  searchTalksByTitleOrSpeaker,
  talksByStatusQuery,
} from './helpers';
import { talkFields, talkTranscriptFields } from './schema';
import { talkTranscriptFetchLastError } from './validators';

const talkPageValidator = paginationResultValidator(
  talkWithSpeakerValidator.extend({
    topicSlugs: v.array(v.string()),
  })
);

const talkAdminPageValidator = paginationResultValidator(
  talkWithSpeakerValidator.extend({
    collectionTitle: v.union(v.null(), v.string()),
    featuredClipTitle: v.union(v.null(), v.string()),
    topicSlugs: v.array(v.string()),
  })
);

const { text: _talkTranscriptText, ...talkTranscriptListFields } =
  talkTranscriptFields;

const talkTranscriptListItemValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('talkTranscripts'),
  ...talkTranscriptListFields,
});

/**
 * List slugs for published talks with their speaker slugs.
 */
export const listTalkSlugs = query({
  args: {},
  handler: async (ctx) => {
    const talks = await enrichWithSpeaker(ctx, {
      items: await listPublishedTalks(ctx),
    });

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
  // fallow-ignore-next-line complexity
  handler: async (ctx, args) => {
    const user = await loadCurrentUser(ctx);

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
      studyFeature: ctx.db
        .query('talkFeatures')
        .withIndex('by_talkId_and_kind', (q) =>
          q.eq('talkId', talk._id).eq('kind', 'study')
        )
        .unique(),
      topics: getManyVia(
        ctx.db,
        'talksOnTopics',
        'topicId',
        'by_talkId',
        talk._id,
        'talkId'
      ),
    };

    const [clips, collection, studyFeature, topics] = await Promise.all([
      queries.clips,
      queries.collection,
      queries.studyFeature,
      queries.topics,
    ]);

    const validTopics = topics.filter((topic) => topic !== null);
    const publishedStudyBody =
      studyFeature?.status === 'published' ? studyFeature.body : null;
    const summary = talk.summary?.trim() ? talk.summary : null;

    return {
      clips,
      collection,
      speaker,
      studyBody: publishedStudyBody,
      summary,
      talk: toPublicTalk(talk),
      topics: validTopics,
    };
  },
  returns: v.nullable(
    v.object({
      clips: docs('clips'),
      collection: doc('collections').nullable(),
      speaker: doc('speakers').nullable(),
      studyBody: v.union(v.null(), v.string()),
      summary: v.union(v.null(), v.string()),
      talk: doc('talks'),
      topics: docs('topics'),
    })
  ),
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

    return await enrichWithSpeaker(ctx, { items: page });
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

    return rotateContent(filteredTalks, { count: limit, period: 'daily' }).map(
      (talk) => toPublicTalk(talk)
    );
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
    const talks = await listPublishedTalksForTopics(ctx, {
      excludeTalkIds,
      topicIds,
    });
    const page = rotateContent(talks, { count: limit, period: 'daily' });

    return await enrichWithSpeaker(ctx, { items: page });
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
      const result = await listPublishedTalksPage(ctx, { paginationOpts });
      const talksWithSpeakers = await enrichWithSpeaker(ctx, {
        items: result.page,
      });
      const enrichedTalks = await enrichWithTopics(ctx, {
        talks: talksWithSpeakers,
      });

      return {
        ...result,
        page: enrichedTalks,
      };
    }

    let talks = hasSearch
      ? await searchPublishedTalksByTitleOrSpeaker(ctx, {
          limit: LIST_SEARCH_LIMIT,
          queryText,
        })
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
      const topicTalkIds = await getTalkIdsByTopicSlugs(ctx, { topicSlugs });

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

    const talksWithSpeakers = await enrichWithSpeaker(ctx, { items: page });
    const enrichedTalks = await enrichWithTopics(ctx, {
      talks: talksWithSpeakers,
    });

    return {
      continueCursor,
      isDone,
      page: enrichedTalks,
    };
  },
  returns: talkPageValidator,
});

function hasTalkStatus(talk: Doc<'talks'>, status: StatusFilterType) {
  return status === 'all' || talk.status === status;
}

function compareTalksForStatusList(
  left: Doc<'talks'>,
  right: Doc<'talks'>,
  status: StatusFilterType
) {
  if (status === 'all') {
    return right._creationTime - left._creationTime;
  }

  return byPublishedAt(left, right);
}

type StudyListStatus = 'none' | Infer<typeof talkStudyStatus>;

async function filterTalksByStudyStatus(
  ctx: QueryCtx,
  args: {
    studyStatus: StudyListStatus;
    talks: Doc<'talks'>[];
  }
) {
  const features = await Promise.all(
    args.talks.map((talk) =>
      loadTalkFeature(ctx, {
        kind: 'study',
        talkId: talk._id,
      })
    )
  );
  const statusByTalkId = new Map(
    features.flatMap((feature) =>
      feature ? [[feature.talkId, feature.status] as const] : []
    )
  );

  return args.talks.filter((talk) => {
    const current = statusByTalkId.get(talk._id);

    if (args.studyStatus === 'none') {
      return current === undefined;
    }

    return current === args.studyStatus;
  });
}

async function pageTalksFromSource<T>(
  source: AsyncIterable<T>,
  toTalk: (item: T) => Promise<Doc<'talks'> | null>,
  paginationOpts: PaginationOptions
) {
  const startIndex = paginationOpts.cursor
    ? Math.trunc(Number(paginationOpts.cursor))
    : 0;
  const page: Doc<'talks'>[] = [];
  let matched = 0;
  let hasMore = false;

  for await (const item of source) {
    // oxlint-disable-next-line no-await-in-loop -- skip until the cursor, then stop once the page is full
    const talk = await toTalk(item);

    if (!talk) {
      continue;
    }

    if (matched < startIndex) {
      matched += 1;
      continue;
    }

    if (page.length < paginationOpts.numItems) {
      page.push(talk);
      matched += 1;
      continue;
    }

    hasMore = true;
    break;
  }

  return {
    continueCursor: hasMore ? String(startIndex + page.length) : '',
    isDone: !hasMore,
    page,
  };
}

async function listTalksWithoutStudy(
  ctx: QueryCtx,
  args: {
    paginationOpts: PaginationOptions;
    status: StatusFilterType;
  }
) {
  return await pageTalksFromSource(
    talksByStatusQuery(ctx, { status: args.status }),
    async (talk) => {
      const feature = await loadTalkFeature(ctx, {
        kind: 'study',
        talkId: talk._id,
      });

      if (feature) {
        return null;
      }

      return talk;
    },
    args.paginationOpts
  );
}

async function listTalksWithStudyStatus(
  ctx: QueryCtx,
  args: {
    paginationOpts: PaginationOptions;
    status: StatusFilterType;
    studyStatus: Infer<typeof talkStudyStatus>;
  }
) {
  const features = await ctx.db
    .query('talkFeatures')
    .withIndex('by_kind_and_status', (q) =>
      q.eq('kind', 'study').eq('status', args.studyStatus)
    )
    .collect();
  const loaded = await Promise.all(
    features.map((feature) => ctx.db.get('talks', feature.talkId))
  );
  const talks = loaded.filter(
    (talk): talk is Doc<'talks'> =>
      talk !== null && hasTalkStatus(talk, args.status)
  );

  talks.sort((left, right) =>
    compareTalksForStatusList(left, right, args.status)
  );

  return paginateArray(
    talks,
    args.paginationOpts.cursor,
    args.paginationOpts.numItems
  );
}

async function listAllTalksByStudyStatus(
  ctx: QueryCtx,
  args: {
    paginationOpts: PaginationOptions;
    search?: string;
    status: StatusFilterType;
    studyStatus: StudyListStatus;
  }
) {
  await requireAdmin(ctx);

  const queryText = normalizeSearchQuery(args.search ?? '');

  if (queryText) {
    const matches = await filterTalksByStudyStatus(ctx, {
      studyStatus: args.studyStatus,
      talks: await searchTalksByTitleOrSpeaker(ctx, {
        limit: LIST_SEARCH_LIMIT,
        queryText,
        status: args.status,
      }),
    });
    const { continueCursor, isDone, page } = paginateArray(
      matches,
      args.paginationOpts.cursor,
      args.paginationOpts.numItems
    );

    return {
      continueCursor,
      isDone,
      page: await enrichTalksForAdmin(ctx, { talks: page }),
    };
  }

  const result =
    args.studyStatus === 'none'
      ? await listTalksWithoutStudy(ctx, {
          paginationOpts: args.paginationOpts,
          status: args.status,
        })
      : await listTalksWithStudyStatus(ctx, {
          paginationOpts: args.paginationOpts,
          status: args.status,
          studyStatus: args.studyStatus,
        });

  return {
    ...result,
    page: await enrichTalksForAdmin(ctx, { talks: result.page }),
  };
}

/**
 * List all talks with speaker data and filtering support.
 * Use status='all' to fetch across all statuses, defaults to 'published'.
 */
export const listAllTalks = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    status: v.optional(statusFilterType),
    studyStatus: v.optional(
      v.union(v.literal('draft'), v.literal('none'), v.literal('published'))
    ),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, search, status = 'published', studyStatus } = args;

    if (studyStatus) {
      return await listAllTalksByStudyStatus(ctx, {
        paginationOpts,
        search,
        status,
        studyStatus,
      });
    }

    return await listAllAdmin(ctx, {
      enrich: (page) => enrichTalksForAdmin(ctx, { talks: page }),
      listPage: () =>
        talksByStatusQuery(ctx, { status }).paginate(paginationOpts),
      paginationOpts,
      search,
      searchItems: (queryText) =>
        searchTalksByTitleOrSpeaker(ctx, {
          limit: LIST_SEARCH_LIMIT,
          queryText,
          status,
        }),
    });
  },
  returns: talkAdminPageValidator,
});

// fallow-ignore-next-line complexity
function getLastErrorByTalk(fetches: Doc<'talkTranscriptFetches'>[]) {
  const latest = new Map<Doc<'talks'>['_id'], Doc<'talkTranscriptFetches'>>();

  for (const fetch of fetches) {
    if (fetch.status !== 'failed' || !fetch.errorCode || !fetch.message) {
      continue;
    }

    const current = latest.get(fetch.talkId);

    if (!current || fetch.checkedAt > current.checkedAt) {
      latest.set(fetch.talkId, fetch);
    }
  }

  return latest;
}

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
    const talks = await talksByStatusQuery(ctx, { status }).collect();
    const [fetches, transcripts] = await Promise.all([
      ctx.db.query('talkTranscriptFetches').collect(),
      ctx.db.query('talkTranscripts').collect(),
    ]);
    const lastErrorByTalk = getLastErrorByTalk(fetches);
    const talkIdsWithTranscript = new Set(
      transcripts.map((transcript) => transcript.talkId)
    );

    return talks
      .filter((talk) => !talkIdsWithTranscript.has(talk._id))
      .map((talk) => {
        const fetch = lastErrorByTalk.get(talk._id);

        return {
          ...talk,
          lastError:
            fetch?.errorCode && fetch.message
              ? {
                  errorCode: fetch.errorCode,
                  message: fetch.message,
                  retryAfter: fetch.retryAfter,
                }
              : null,
        };
      });
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id('talks'),
      ...talkFields,
      lastError: v.union(talkTranscriptFetchLastError, v.null()),
    })
  ),
});

async function loadTalkTranscript(
  ctx: QueryCtx,
  args: { talkId: Id<'talks'> }
) {
  await requireAdmin(ctx);

  return await getOneFrom(ctx.db, 'talkTranscripts', 'by_talkId', args.talkId);
}

/**
 * Transcript metadata for one talk. Omits transcript text.
 */
export const getTalkTranscript = query({
  args: { talkId: v.id('talks') },
  handler: async (ctx, { talkId }) => {
    const transcript = await loadTalkTranscript(ctx, { talkId });

    if (!transcript) {
      return null;
    }

    const { text: _text, ...item } = transcript;

    return item;
  },
  returns: v.union(v.null(), talkTranscriptListItemValidator),
});

/**
 * Transcript text for one talk. Load only when an admin opens the editor.
 */
export const getTalkTranscriptText = query({
  args: { talkId: v.id('talks') },
  handler: async (ctx, { talkId }) => {
    const transcript = await loadTalkTranscript(ctx, { talkId });

    if (!transcript) {
      return null;
    }

    return {
      text: transcript.text ?? '',
    };
  },
  returns: v.union(
    v.null(),
    v.object({
      text: v.string(),
    })
  ),
});

export const getTalkTranscriptFetch = query({
  args: { talkId: v.id('talks') },
  handler: async (ctx, { talkId }) => {
    await requireAdmin(ctx);

    return await ctx.db
      .query('talkTranscriptFetches')
      .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
      .order('desc')
      .first();
  },
  returns: doc('talkTranscriptFetches').nullable(),
});
