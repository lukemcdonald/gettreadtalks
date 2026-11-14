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
import { getPublishedAt, isFuturePublishedAt } from '../../lib/publishedAt';
import {
  deleteAll,
  getOrThrow,
  slugify,
  talkSlugExistsForSpeaker,
} from '../../lib/utils';
import { hasTalkTranscriptSource } from '../../lib/videoUrl';
import { requireAdmin } from '../auth/helpers';
import {
  clearMediaChecksForEntity,
  clearStaleMediaChecks,
} from '../mediaHealth/check/clear';
import { clearTalkDraftStep } from './autoDraft';
import { talkTranscriptFields } from './schema';
import { createPendingTalkTranscriptFetch } from './transcriptFetch';
import { statusType, talkTranscriptFetchErrorCode } from './validators';

async function setTalkTopics(
  ctx: MutationCtx,
  {
    talkId,
    topicIds,
  }: {
    talkId: Id<'talks'>;
    topicIds: Id<'topics'>[];
  }
) {
  const uniqueTopicIds = [...new Set(topicIds)];

  await Promise.all(
    uniqueTopicIds.map((topicId) =>
      getOrThrow(ctx, {
        id: topicId,
        table: 'topics',
      })
    )
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

async function applyTalkSlugUpdate(
  ctx: MutationCtx,
  {
    rawSlug,
    speakerId,
    talk,
    talkId,
    updates,
  }: {
    rawSlug: string;
    speakerId: Id<'speakers'>;
    talk: Doc<'talks'>;
    talkId: Id<'talks'>;
    updates: Partial<Doc<'talks'>>;
  }
) {
  const newSlug = slugify(rawSlug);

  if (!newSlug) {
    throwValidationError('Slug cannot be empty', 'slug');
  }

  if (newSlug === talk.slug) {
    return;
  }

  if (
    await talkSlugExistsForSpeaker(ctx, {
      excludeId: talkId,
      slug: newSlug,
      speakerId,
    })
  ) {
    throwDuplicateSlug(
      'A talk with this slug already exists for this speaker',
      'slug'
    );
  }

  updates.slug = newSlug;
}

function publishedAtForTalk({
  currentPublishedAt,
  requestedPublishedAt,
  status,
  wasPublished,
}: {
  currentPublishedAt?: number;
  requestedPublishedAt?: null | number;
  status: StatusType;
  wasPublished?: boolean;
}): number | undefined {
  const publishedAt = getPublishedAt({
    currentPublishedAt,
    requestedPublishedAt,
    status,
    wasPublished,
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

    const talk = await getOrThrow(ctx, {
      id: talkId,
      table: 'talks',
    });

    const isArchived = talk.status === 'archived';
    const newStatus = isArchived ? 'backlog' : 'archived';

    await ctx.db.patch(talkId, {
      status: newStatus,
      updatedAt: Date.now(),
    });

    await clearMediaChecksForEntity(ctx, {
      entityId: talkId,
      entityTable: 'talks',
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

    if (
      await talkSlugExistsForSpeaker(ctx, {
        slug,
        speakerId: talkArgs.speakerId,
      })
    ) {
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
      await setTalkTopics(ctx, {
        talkId,
        topicIds,
      });
    }

    // YouTube talks draft the transcript, summary, and study in the background.
    if (hasTalkTranscriptSource(talkArgs.mediaUrl)) {
      const runId = await createPendingTalkTranscriptFetch(ctx, { talkId });

      await ctx.scheduler.runAfter(0, internal.talks.fetchTalkTranscript, {
        continueDraft: true,
        mediaUrl: talkArgs.mediaUrl,
        runId,
        talkId,
      });
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
    publishedAt: v.optional(v.union(v.null(), v.number())),
    scripture: v.optional(v.string()),
    slug: v.optional(v.string()),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(statusType),
    summary: v.optional(v.string()),
    talkId: v.id('talks'),
    title: v.optional(v.string()),
    topicIds: v.optional(v.array(v.id('topics'))),
  },
  handler: async (ctx, args) => {
    const {
      publishedAt: requestedPublishedAt,
      slug: rawSlug,
      summary,
      talkId,
      topicIds,
      ...rest
    } = args;

    await requireAdmin(ctx);

    const updates: Partial<Doc<'talks'>> = rest;
    const talk = await getOrThrow(ctx, {
      id: talkId,
      table: 'talks',
    });
    const speakerIdToCheck = updates.speakerId || talk.speakerId;

    if (updates.title !== undefined && !updates.title.trim()) {
      throwValidationError('Title cannot be empty', 'title');
    }

    if (rawSlug !== undefined) {
      await applyTalkSlugUpdate(ctx, {
        rawSlug,
        speakerId: speakerIdToCheck,
        talk,
        talkId,
        updates,
      });
    }

    updates.publishedAt = publishedAtForTalk({
      currentPublishedAt: talk.publishedAt,
      requestedPublishedAt,
      status: updates.status ?? talk.status,
      wasPublished: talk.status === 'published',
    });
    updates.updatedAt = Date.now();

    if (summary !== undefined) {
      Object.assign(updates, getTalkSummaryPatch(talk, summary));
    }

    await ctx.db.patch(talkId, updates);

    if (summary !== undefined) {
      await clearTalkDraftStep(ctx, {
        step: 'summary',
        talkId,
      });
    }

    if (topicIds !== undefined) {
      await setTalkTopics(ctx, {
        talkId,
        topicIds,
      });
    }

    await clearStaleMediaChecks(ctx, {
      entityId: talkId,
      entityTable: 'talks',
      nextMediaUrl: updates.mediaUrl,
      nextStatus: updates.status,
      previousMediaUrl: talk.mediaUrl,
      previousStatus: talk.status,
    });

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

    await getOrThrow(ctx, {
      id: talkId,
      table: 'talks',
    });

    await clearMediaChecksForEntity(ctx, {
      entityId: talkId,
      entityTable: 'talks',
    });

    const [features, fetches, studies, talksOnTopics, transcripts] =
      await Promise.all([
        ctx.db
          .query('talkFeatures')
          .withIndex('by_talkId_and_kind', (q) => q.eq('talkId', talkId))
          .collect(),
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

    await deleteAll(ctx, { items: features });
    await deleteAll(ctx, { items: fetches });
    await deleteAll(ctx, { items: studies });
    await deleteAll(ctx, { items: talksOnTopics });
    await deleteAll(ctx, { items: transcripts });

    const favorites = await ctx.db
      .query('userFavoriteTalks')
      .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
      .collect();

    await deleteAll(ctx, { items: favorites });

    const finished = await ctx.db
      .query('userFinishedTalks')
      .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
      .collect();

    await deleteAll(ctx, { items: finished });

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
    await getOrThrow(ctx, {
      id: args.talkId,
      table: 'talks',
    });

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

function hasManuallyEditedTalkSummary(talk: Doc<'talks'>) {
  return talk.summaryManuallyEditedAt !== undefined;
}

function getTalkSummaryPatch(talk: Doc<'talks'>, summary: string) {
  const editedAt = Date.now();

  return {
    draftSummary: undefined,
    summary,
    summaryGeneratedAt: talk.summaryGeneratedAt ?? editedAt,
    summaryGenerator: talk.summaryGenerator ?? 'manual',
    summaryManuallyEditedAt: editedAt,
  };
}

/**
 * Save a generated talk summary. Never overwrites a manually edited summary.
 */
export const saveTalkSummaryDraft = internalMutation({
  args: {
    generator: v.string(),
    summary: v.string(),
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    const talk = await getOrThrow(ctx, {
      id: args.talkId,
      table: 'talks',
    });

    if (hasManuallyEditedTalkSummary(talk)) {
      throwConvexError(409, 'Summary already edited');
    }

    await ctx.db.patch(args.talkId, {
      draftSummary: args.summary,
      summaryGeneratedAt: Date.now(),
      summaryGenerator: args.generator,
    });

    return args.talkId;
  },
  returns: v.id('talks'),
});

export const updateTalkSummary = mutation({
  args: {
    summary: v.string(),
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const talk = await getOrThrow(ctx, {
      id: args.talkId,
      table: 'talks',
    });

    await ctx.db.patch(args.talkId, getTalkSummaryPatch(talk, args.summary));
    await clearTalkDraftStep(ctx, {
      step: 'summary',
      talkId: args.talkId,
    });

    return args.talkId;
  },
  returns: v.id('talks'),
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

    const talk = await getOrThrow(ctx, {
      id: talkId,
      table: 'talks',
    });
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

    const runId = await createPendingTalkTranscriptFetch(ctx, { talkId });

    await ctx.scheduler.runAfter(0, internal.talks.fetchTalkTranscript, {
      mediaUrl: talk.mediaUrl,
      runId,
      talkId,
    });

    return runId;
  },
  returns: v.id('talkTranscriptFetches'),
});

export const completeTalkTranscriptFetch = internalMutation({
  args: {
    errorCode: v.optional(talkTranscriptFetchErrorCode),
    keepExistingTranscript: v.optional(v.boolean()),
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

    if (!run || run.status !== 'pending') {
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
      const fetches = await ctx.db
        .query('talkTranscriptFetches')
        .withIndex('by_talkId', (q) => q.eq('talkId', args.talkId))
        .collect();
      const hasNewerSuccess = fetches.some(
        (row) =>
          row._id !== args.runId &&
          row.status === 'success' &&
          row._creationTime > run._creationTime
      );

      if (hasNewerSuccess) {
        return null;
      }

      const existing = await ctx.db
        .query('talkTranscripts')
        .withIndex('by_talkId', (q) => q.eq('talkId', args.talkId))
        .unique();

      if (existing?.text?.trim() && args.keepExistingTranscript) {
        return null;
      }

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
