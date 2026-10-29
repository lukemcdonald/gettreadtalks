import type { Doc, Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';
import type { StatusType } from '../../lib/types';

import { getOneFrom } from 'convex-helpers/server/relationships';
import { v } from 'convex/values';

import { internal } from '../../_generated/api';
import { internalMutation, mutation } from '../../_generated/server';
import {
  throwConvexError,
  throwDuplicateSlug,
  throwNotFound,
  throwValidationError,
} from '../../lib/errors';
import { isFuturePublishedAt, resolvePublishedAt } from '../../lib/publishedAt';
import {
  deleteAll,
  getOrThrow,
  slugify,
  talkSlugExistsForSpeaker,
} from '../../lib/utils';
import { requireAdmin } from '../auth/roles';
import { talkTranscriptFields } from './schema';
import {
  statusType,
  talkStudyContentFields,
  talkStudyStatus,
  talkTranscriptFetchErrorCode,
} from './validators';

async function setTalkTopics(
  ctx: MutationCtx,
  talkId: Id<'talks'>,
  topicIds: Id<'topics'>[]
) {
  const uniqueTopicIds = [...new Set(topicIds)];

  await Promise.all(
    uniqueTopicIds.map((topicId) => getOrThrow(ctx, 'topics', topicId))
  );

  const existing = await ctx.db
    .query('talksOnTopics')
    .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
    .collect();

  const existingIds = new Set(existing.map((row) => row.topicId));
  const nextIds = new Set(uniqueTopicIds);

  await Promise.all(
    existing
      .filter((row) => !nextIds.has(row.topicId))
      .map((row) => ctx.db.delete(row._id))
  );

  await Promise.all(
    uniqueTopicIds
      .filter((topicId) => !existingIds.has(topicId))
      .map((topicId) =>
        ctx.db.insert('talksOnTopics', {
          talkId,
          topicId,
        })
      )
  );
}

function publishedAtForTalk({
  currentPublishedAt,
  requestedPublishedAt,
  status,
}: {
  currentPublishedAt?: number;
  requestedPublishedAt?: number;
  status: StatusType;
}): number | undefined {
  const publishedAt = resolvePublishedAt({
    currentPublishedAt,
    requestedPublishedAt,
    status,
  });

  if (publishedAt !== undefined && isFuturePublishedAt(publishedAt)) {
    throwValidationError('Publish date cannot be in the future', 'publishedAt');
  }

  return publishedAt;
}

/**
 * Archive a talk (soft delete by setting status to archived).
 */
export const archiveTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    const { talkId } = args;

    await requireAdmin(ctx);

    const talk = await getOrThrow(ctx, 'talks', talkId);

    const isArchived = talk.status === 'archived';
    const newStatus = isArchived ? 'backlog' : 'archived';

    await ctx.db.patch(talkId, {
      publishedAt: isArchived ? undefined : talk.publishedAt,
      status: newStatus,
      updatedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Create a new talk.
 */
export const createTalk = mutation({
  args: {
    collectionId: v.optional(v.id('collections')),
    collectionOrder: v.optional(v.number()),
    featured: v.optional(v.boolean()),
    mediaUrl: v.string(),
    publishedAt: v.optional(v.number()),
    scripture: v.optional(v.string()),
    speakerId: v.id('speakers'),
    status: v.optional(statusType),
    title: v.string(),
    topicIds: v.optional(v.array(v.id('topics'))),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const { publishedAt: requestedPublishedAt, topicIds, ...talkArgs } = args;

    if (!talkArgs.title.trim()) {
      throwValidationError('Title cannot be empty', 'title');
    }

    const slug = slugify(talkArgs.title);

    if (await talkSlugExistsForSpeaker(ctx, talkArgs.speakerId, slug)) {
      throwDuplicateSlug(
        'Talk with this title already exists for this speaker',
        'title'
      );
    }

    const status = talkArgs.status || 'backlog';
    const publishedAt = publishedAtForTalk({
      requestedPublishedAt,
      status,
    });

    const talkId = await ctx.db.insert('talks', {
      ...talkArgs,
      publishedAt,
      slug,
      status,
    });

    if (topicIds !== undefined) {
      await setTalkTopics(ctx, talkId, topicIds);
    }

    return talkId;
  },
  returns: v.id('talks'),
});

/**
 * Update an existing talk.
 */
export const updateTalk = mutation({
  args: {
    collectionId: v.optional(v.id('collections')),
    collectionOrder: v.optional(v.number()),
    featured: v.optional(v.boolean()),
    mediaUrl: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    scripture: v.optional(v.string()),
    slug: v.optional(v.string()),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(statusType),
    talkId: v.id('talks'),
    title: v.optional(v.string()),
    topicIds: v.optional(v.array(v.id('topics'))),
  },
  handler: async (ctx, args) => {
    const {
      publishedAt: requestedPublishedAt,
      slug: rawSlug,
      talkId,
      topicIds,
      ...rest
    } = args;

    await requireAdmin(ctx);

    const updates: Partial<Doc<'talks'>> = rest;
    const talk = await getOrThrow(ctx, 'talks', talkId);
    const speakerIdToCheck = updates.speakerId || talk.speakerId;

    if (updates.title !== undefined && !updates.title.trim()) {
      throwValidationError('Title cannot be empty', 'title');
    }

    // Use explicit slug if provided, otherwise keep existing slug
    if (rawSlug !== undefined) {
      const newSlug = slugify(rawSlug);

      if (!newSlug) {
        throwValidationError('Slug cannot be empty', 'slug');
      }

      if (newSlug !== talk.slug) {
        if (
          await talkSlugExistsForSpeaker(ctx, speakerIdToCheck, newSlug, talkId)
        ) {
          throwDuplicateSlug(
            'A talk with this slug already exists for this speaker',
            'slug'
          );
        }

        updates.slug = newSlug;
      }
    }

    updates.publishedAt = publishedAtForTalk({
      currentPublishedAt: talk.publishedAt,
      requestedPublishedAt,
      status: updates.status ?? talk.status,
    });
    updates.updatedAt = Date.now();

    await ctx.db.patch(talkId, updates);

    if (topicIds !== undefined) {
      await setTalkTopics(ctx, talkId, topicIds);
    }

    return talkId;
  },
  returns: v.id('talks'),
});

/**
 * Destroy a talk (permanently delete from database with cleanup of related records).
 */
export const destroyTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    const { talkId } = args;

    await requireAdmin(ctx);

    await getOrThrow(ctx, 'talks', talkId);

    const [fetches, studies, talksOnTopics, transcripts] = await Promise.all([
      ctx.db
        .query('talkTranscriptFetches')
        .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
        .collect(),
      ctx.db
        .query('talkStudies')
        .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
        .collect(),
      ctx.db
        .query('talksOnTopics')
        .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
        .collect(),
      ctx.db
        .query('talkTranscripts')
        .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
        .collect(),
    ]);

    await deleteAll(ctx, fetches);
    await deleteAll(ctx, studies);
    await deleteAll(ctx, talksOnTopics);
    await deleteAll(ctx, transcripts);

    const favorites = await ctx.db
      .query('userFavoriteTalks')
      .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
      .collect();

    await deleteAll(ctx, favorites);

    const finished = await ctx.db
      .query('userFinishedTalks')
      .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
      .collect();

    await deleteAll(ctx, finished);

    // Clips remain intact - talkId is optional and nullability is intentional

    await ctx.db.delete(talkId);

    return null;
  },
  returns: v.null(),
});

/**
 * Upsert a private talk transcript.
 */
export const upsertTalkTranscript = internalMutation({
  args: talkTranscriptFields,
  handler: async (ctx, args) => {
    await getOrThrow(ctx, 'talks', args.talkId);

    const existing = await ctx.db
      .query('talkTranscripts')
      .withIndex('by_talkId', (q) => q.eq('talkId', args.talkId))
      .unique();

    if (existing) {
      await ctx.db.replace(existing._id, args);

      return existing._id;
    }

    return await ctx.db.insert('talkTranscripts', args);
  },
  returns: v.id('talkTranscripts'),
});

/**
 * Save a study draft. Always stores studyStatus `draft`; never publishes.
 */
export const saveTalkStudyDraft = internalMutation({
  args: {
    generator: v.string(),
    ...talkStudyContentFields,
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    await getOrThrow(ctx, 'talks', args.talkId);

    const existing = await ctx.db
      .query('talkStudies')
      .withIndex('by_talkId', (q) => q.eq('talkId', args.talkId))
      .unique();
    const fields = {
      generatedAt: Date.now(),
      generator: args.generator,
      outline: args.outline,
      scriptureRefs: args.scriptureRefs,
      studyGuide: args.studyGuide,
      studyStatus: 'draft' as const,
      suggestedTopics: args.suggestedTopics,
      summary: args.summary,
      talkId: args.talkId,
    };

    if (existing) {
      if (
        existing.studyStatus === 'published' ||
        existing.manuallyEditedAt !== undefined
      ) {
        throwConvexError(409, 'Study already reviewed');
      }

      await ctx.db.replace(existing._id, fields);

      return existing._id;
    }

    return await ctx.db.insert('talkStudies', fields);
  },
  returns: v.id('talkStudies'),
});

export const updateTalkStudy = mutation({
  args: {
    studyStatus: talkStudyStatus,
    summary: v.string(),
    talkId: v.id('talks'),
  },
  handler: async (ctx, { studyStatus, summary, talkId }) => {
    await requireAdmin(ctx);

    const study =
      (await getOneFrom(ctx.db, 'talkStudies', 'by_talkId', talkId)) ??
      throwNotFound('Study not found', {
        resource: 'talkStudy',
        resourceId: talkId,
      });

    await ctx.db.patch(study._id, {
      manuallyEditedAt: Date.now(),
      studyStatus,
      summary,
    });

    return study._id;
  },
  returns: v.id('talkStudies'),
});

export const updateTalkTranscript = mutation({
  args: {
    talkId: v.id('talks'),
    text: v.string(),
  },
  handler: async (ctx, { talkId, text }) => {
    await requireAdmin(ctx);

    const trimmed = text.trim();

    if (!trimmed) {
      throwValidationError('Transcript cannot be empty', 'text');
    }

    const transcript =
      (await getOneFrom(ctx.db, 'talkTranscripts', 'by_talkId', talkId)) ??
      throwNotFound('Transcript not found', {
        resource: 'talkTranscript',
        resourceId: talkId,
      });

    await ctx.db.patch(transcript._id, {
      text: trimmed,
    });

    return transcript._id;
  },
  returns: v.id('talkTranscripts'),
});

export const createTalkTranscriptFetch = mutation({
  args: {
    confirmRefetch: v.optional(v.boolean()),
    talkId: v.id('talks'),
  },
  handler: async (ctx, { confirmRefetch = false, talkId }) => {
    await requireAdmin(ctx);

    const talk = await getOrThrow(ctx, 'talks', talkId);
    const existingFetches = await ctx.db
      .query('talkTranscriptFetches')
      .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
      .collect();
    const pending = existingFetches.find((row) => row.status === 'pending');

    if (pending) {
      return pending._id;
    }

    const existingTranscript = await getOneFrom(
      ctx.db,
      'talkTranscripts',
      'by_talkId',
      talkId
    );

    if (existingTranscript && !confirmRefetch) {
      throwValidationError(
        'This talk already has a transcript. Confirm to fetch it again.'
      );
    }

    const runId = await ctx.db.insert('talkTranscriptFetches', {
      checkedAt: Date.now(),
      status: 'pending',
      talkId,
    });

    await ctx.scheduler.runAfter(0, internal.talks.fetchTalkTranscript, {
      mediaUrl: talk.mediaUrl,
      runId,
      talkId,
    });

    return runId;
  },
  returns: v.id('talkTranscriptFetches'),
});

/**
 * Fill publishedAt for published talks that are missing it.
 * Safe to re-run: never overwrites an existing date.
 */
export const backfillTalkPublishedAt = internalMutation({
  args: {},
  handler: async (ctx) => {
    const talks = await ctx.db.query('talks').collect();
    const missing = talks.filter(
      (talk) => talk.status === 'published' && talk.publishedAt === undefined
    );

    await Promise.all(
      missing.map((talk) =>
        ctx.db.patch(talk._id, {
          publishedAt: talk._creationTime,
        })
      )
    );

    return {
      scanned: talks.length,
      updated: missing.length,
    };
  },
  returns: v.object({
    scanned: v.number(),
    updated: v.number(),
  }),
});

export const completeTalkTranscriptFetch = internalMutation({
  args: {
    errorCode: v.optional(talkTranscriptFetchErrorCode),
    message: v.optional(v.string()),
    retryAfter: v.optional(v.number()),
    runId: v.id('talkTranscriptFetches'),
    status: v.union(v.literal('failed'), v.literal('success')),
    talkId: v.id('talks'),
    text: v.optional(v.string()),
  },
  // fallow-ignore-next-line complexity
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);

    if (run?.status !== 'pending') {
      return null;
    }

    await ctx.db.patch(args.runId, {
      checkedAt: Date.now(),
      errorCode: args.errorCode,
      message: args.message,
      retryAfter: args.retryAfter,
      status: args.status,
    });

    if (args.status === 'success' && args.text) {
      const existing = await ctx.db
        .query('talkTranscripts')
        .withIndex('by_talkId', (q) => q.eq('talkId', args.talkId))
        .unique();
      const fields = {
        fetchedAt: Date.now(),
        source: 'youtube_captions' as const,
        status: 'done' as const,
        talkId: args.talkId,
        text: args.text,
      };

      if (existing) {
        await ctx.db.replace(existing._id, fields);
        return null;
      }

      await ctx.db.insert('talkTranscripts', fields);
    }

    return null;
  },
  returns: v.null(),
});
