import type { Doc, Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';

import { v } from 'convex/values';

import { internalMutation, mutation } from '../../_generated/server';
import {
  throwConvexError,
  throwDuplicateSlug,
  throwNotFound,
  throwValidationError,
} from '../../lib/errors';
import {
  deleteAll,
  getOrThrow,
  getPublishedAtForStatus,
  slugify,
  talkSlugExistsForSpeaker,
} from '../../lib/utils';
import { requireAdmin } from '../auth/roles';
import { talkTranscriptFields } from './schema';
import { statusType, talkStudyContentFields } from './validators';

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
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    mediaUrl: v.string(),
    scripture: v.optional(v.string()),
    speakerId: v.id('speakers'),
    status: v.optional(statusType),
    title: v.string(),
    topicIds: v.optional(v.array(v.id('topics'))),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const { topicIds, ...talkArgs } = args;

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
    const publishedAt = getPublishedAtForStatus(status);

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
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    mediaUrl: v.optional(v.string()),
    scripture: v.optional(v.string()),
    slug: v.optional(v.string()),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(statusType),
    talkId: v.id('talks'),
    title: v.optional(v.string()),
    topicIds: v.optional(v.array(v.id('topics'))),
  },
  handler: async (ctx, args) => {
    const { slug: rawSlug, talkId, topicIds, ...rest } = args;

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

    if (updates.status) {
      updates.publishedAt = getPublishedAtForStatus(
        updates.status,
        talk.publishedAt
      );
    }

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

    const [studies, talksOnTopics, transcripts] = await Promise.all([
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

async function getTalkStudyByTalkId(ctx: MutationCtx, talkId: Id<'talks'>) {
  const study = await ctx.db
    .query('talkStudies')
    .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
    .unique();

  if (!study) {
    throwNotFound('Study not found', {
      resource: 'talkStudy',
      resourceId: talkId,
    });
  }

  return study;
}

/**
 * Update a talk's study content and mark it as manually edited.
 */
export const updateTalkStudy = mutation({
  args: {
    ...talkStudyContentFields,
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    const { talkId, ...content } = args;

    await requireAdmin(ctx);

    const study = await getTalkStudyByTalkId(ctx, talkId);

    await ctx.db.patch(study._id, {
      ...content,
      manuallyEditedAt: Date.now(),
    });

    return study._id;
  },
  returns: v.id('talkStudies'),
});

async function setTalkStudyStatus(
  ctx: MutationCtx,
  studyStatus: 'draft' | 'published',
  talkId: Id<'talks'>
) {
  await requireAdmin(ctx);

  const study = await getTalkStudyByTalkId(ctx, talkId);

  await ctx.db.patch(study._id, {
    studyStatus,
  });

  return study._id;
}

/**
 * Publish one talk study.
 */
export const publishTalkStudy = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) =>
    await setTalkStudyStatus(ctx, 'published', args.talkId),
  returns: v.id('talkStudies'),
});

/**
 * Return one talk study to draft.
 */
export const unpublishTalkStudy = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) =>
    await setTalkStudyStatus(ctx, 'draft', args.talkId),
  returns: v.id('talkStudies'),
});
