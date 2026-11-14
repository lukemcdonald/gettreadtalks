import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { StatusFilterType } from '../../lib/types';
import type { SearchArgs, StatusSearchArgs } from '../search/helpers';
import type { PaginationOptions } from 'convex/server';

import { asyncMap } from 'convex-helpers';
import { getManyVia } from 'convex-helpers/server/relationships';

import { enrichWithSpeaker, loadUntilFull } from '../../lib/utils';
import {
  DEFAULT_SEARCH_LIMIT,
  searchTitleQuery,
  uniqueById,
} from '../search/helpers';
import { searchPublishedSpeakers, searchSpeakers } from '../speakers/helpers';

function publishedTalksQuery(ctx: QueryCtx) {
  return ctx.db
    .query('talks')
    .withIndex('by_status_and_publishedAt', (q) => q.eq('status', 'published'))
    .order('desc');
}

export function talksByStatusQuery(
  ctx: QueryCtx,
  args: { status: StatusFilterType }
) {
  const { status } = args;

  if (status === 'all') {
    return ctx.db.query('talks').order('desc');
  }

  return ctx.db
    .query('talks')
    .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
    .order('desc');
}

export async function listPublishedTalks(ctx: QueryCtx) {
  return await publishedTalksQuery(ctx).collect();
}

export async function listPublishedTalksPage(
  ctx: QueryCtx,
  args: { paginationOpts: PaginationOptions }
) {
  return await publishedTalksQuery(ctx).paginate(args.paginationOpts);
}

function publishedTalksForCollectionQuery(
  ctx: QueryCtx,
  args: { collectionId: Id<'collections'> }
) {
  return ctx.db
    .query('talks')
    .withIndex('by_collectionId_and_status', (q) =>
      q.eq('collectionId', args.collectionId).eq('status', 'published')
    );
}

export async function listPublishedTalksForCollection(
  ctx: QueryCtx,
  args: {
    collectionId: Id<'collections'>;
    limit?: number;
  }
) {
  const talks = publishedTalksForCollectionQuery(ctx, {
    collectionId: args.collectionId,
  });

  return await (args.limit ? talks.take(args.limit) : talks.collect());
}

export async function listTalksForCollection(
  ctx: QueryCtx,
  args: { collectionId: Id<'collections'> }
) {
  return await ctx.db
    .query('talks')
    .withIndex('by_collectionId_and_status', (q) =>
      q.eq('collectionId', args.collectionId)
    )
    .collect();
}

export async function listPublishedTalksForTopic(
  ctx: QueryCtx,
  args: { topicId: Id<'topics'> }
) {
  const talks = await getManyVia(
    ctx.db,
    'talksOnTopics',
    'talkId',
    'by_topicId',
    args.topicId,
    'topicId'
  );

  return talks.filter(
    (talk): talk is Doc<'talks'> => talk !== null && talk.status === 'published'
  );
}

const TALKS_PER_TOPIC = 24;

/** Published talks that share any of the given topics, excluding listed ids. */
export async function listPublishedTalksForTopics(
  ctx: QueryCtx,
  args: {
    excludeTalkIds?: Iterable<string>;
    topicIds: Id<'topics'>[];
  }
) {
  if (args.topicIds.length === 0) {
    return [];
  }

  const excludedTalkIds = new Set(args.excludeTalkIds);
  const takePerTopic = TALKS_PER_TOPIC + excludedTalkIds.size;

  const talkPages = await Promise.all(
    args.topicIds.map(async (topicId) => {
      const joins = await ctx.db
        .query('talksOnTopics')
        .withIndex('by_topicId', (q) => q.eq('topicId', topicId))
        .order('desc')
        .take(takePerTopic);

      const talks = await Promise.all(
        joins.map((join) => ctx.db.get('talks', join.talkId))
      );

      return talks.filter(
        (talk): talk is Doc<'talks'> =>
          talk !== null &&
          talk.status === 'published' &&
          !excludedTalkIds.has(talk._id)
      );
    })
  );

  return uniqueById(talkPages.flat());
}

export async function searchTalks(ctx: QueryCtx, args: StatusSearchArgs) {
  return await ctx.db
    .query('talks')
    .withSearchIndex(
      'search_title',
      searchTitleQuery(args.queryText, args.status)
    )
    .take(args.limit);
}

type PublishedTalkSearchArgs = SearchArgs & {
  format?: Doc<'talks'>['format'];
};

type TalkSearchArgs = StatusSearchArgs & {
  format?: Doc<'talks'>['format'];
};

export async function searchPublishedTalks(
  ctx: QueryCtx,
  args: PublishedTalkSearchArgs
) {
  return await loadUntilFull(
    ctx.db
      .query('talks')
      .withSearchIndex(
        'search_title',
        searchTitleQuery(args.queryText, 'published')
      ),
    async (talk) => {
      if (args.format && talk.format !== args.format) {
        return false;
      }

      const speaker = await ctx.db.get('speakers', talk.speakerId);

      return speaker !== null;
    },
    args.limit
  );
}

function talksForSpeakerQuery(
  ctx: QueryCtx,
  args: {
    speakerId: Id<'speakers'>;
    status?: StatusFilterType;
  }
) {
  return ctx.db.query('talks').withIndex('by_speakerId_and_status', (q) => {
    const bySpeaker = q.eq('speakerId', args.speakerId);

    return args.status && args.status !== 'all'
      ? bySpeaker.eq('status', args.status)
      : bySpeaker;
  });
}

async function loadTalksByNamedSpeakers(ctx: QueryCtx, args: TalkSearchArgs) {
  const searchSpeakersByName =
    args.status === 'published' ? searchPublishedSpeakers : searchSpeakers;
  const speakers = await searchSpeakersByName(ctx, {
    limit: DEFAULT_SEARCH_LIMIT,
    queryText: args.queryText,
  });

  if (speakers.length === 0) {
    return [];
  }

  const speakerTalkPages = await Promise.all(
    speakers.map((speaker) => {
      const talks = talksForSpeakerQuery(ctx, {
        speakerId: speaker._id,
        status: args.status,
      });

      if (!args.format) {
        return talks.take(args.limit);
      }

      return loadUntilFull(
        talks,
        (talk) => talk.format === args.format,
        args.limit
      );
    })
  );
  return uniqueById(speakerTalkPages.flat()).slice(0, args.limit);
}

/** Title matches plus talks by speakers whose names match. */
export async function searchTalksByTitleOrSpeaker(
  ctx: QueryCtx,
  args: TalkSearchArgs
) {
  const [titleHits, speakerTalks] = await Promise.all([
    args.status === 'published'
      ? searchPublishedTalks(ctx, {
          format: args.format,
          limit: args.limit,
          queryText: args.queryText,
        })
      : searchTalks(ctx, {
          limit: args.limit,
          queryText: args.queryText,
          status: args.status,
        }),
    loadTalksByNamedSpeakers(ctx, {
      format: args.format,
      limit: args.limit,
      queryText: args.queryText,
      status: args.status,
    }),
  ]);

  return uniqueById<Doc<'talks'>>([...titleHits, ...speakerTalks]).slice(
    0,
    args.limit
  );
}

export async function searchPublishedTalksByTitleOrSpeaker(
  ctx: QueryCtx,
  args: PublishedTalkSearchArgs
) {
  return await searchTalksByTitleOrSpeaker(ctx, {
    format: args.format,
    limit: args.limit,
    queryText: args.queryText,
    status: 'published',
  });
}

/**
 * Enrich talks with topic slugs for client-side filtering.
 * Composable: works with raw talks or already-enriched talks.
 */
export async function enrichWithTopics<T extends { _id: Id<'talks'> }>(
  ctx: QueryCtx,
  args: { talks: T[] }
): Promise<(T & { topicSlugs: string[] })[]> {
  return await asyncMap(args.talks, async (talk: T) => {
    const talksOnTopics = await ctx.db
      .query('talksOnTopics')
      .withIndex('by_talkId', (q) => q.eq('talkId', talk._id))
      .collect();

    const topics = await Promise.all(
      talksOnTopics.map((tot) => ctx.db.get('topics', tot.topicId))
    );

    const topicSlugs = topics
      .filter((topic): topic is Doc<'topics'> => topic !== null)
      .map((topic) => topic.slug);

    return { ...talk, topicSlugs };
  });
}

function collectionTitleForTalk(
  collectionId: Id<'collections'> | undefined,
  titlesByCollectionId: Map<Id<'collections'>, string>
) {
  if (!collectionId) {
    return null;
  }

  return titlesByCollectionId.get(collectionId) ?? null;
}

async function featuredClipTitleForTalk(
  ctx: QueryCtx,
  args: { talkId: Id<'talks'> }
) {
  const clip = await ctx.db
    .query('clips')
    .withIndex('by_talkId', (q) => q.eq('talkId', args.talkId))
    .first();

  return clip?.title ?? null;
}

async function loadCollectionTitles(
  ctx: QueryCtx,
  args: { talks: { collectionId?: Id<'collections'> }[] }
) {
  const collectionIds = [
    ...new Set(
      args.talks.flatMap((talk) =>
        talk.collectionId ? [talk.collectionId] : []
      )
    ),
  ];
  const collections = await Promise.all(
    collectionIds.map((collectionId) => ctx.db.get('collections', collectionId))
  );

  return new Map(
    collections.flatMap((collection) =>
      collection ? [[collection._id, collection.title] as const] : []
    )
  );
}

export async function enrichTalksForAdmin(
  ctx: QueryCtx,
  args: { talks: Doc<'talks'>[] }
) {
  const talksWithTopics = await enrichWithTopics(ctx, {
    talks: await enrichWithSpeaker(ctx, { items: args.talks }),
  });
  const titlesByCollectionId = await loadCollectionTitles(ctx, {
    talks: talksWithTopics,
  });

  return await asyncMap(talksWithTopics, async (talk) => ({
    ...talk,
    collectionTitle: collectionTitleForTalk(
      talk.collectionId,
      titlesByCollectionId
    ),
    featuredClipTitle: await featuredClipTitleForTalk(ctx, {
      talkId: talk._id,
    }),
  }));
}
