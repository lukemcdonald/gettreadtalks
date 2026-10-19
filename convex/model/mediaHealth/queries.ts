import type { Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { PaginationOptions } from 'convex/server';

import {
  paginationOptsValidator,
  paginationResultValidator,
} from 'convex/server';
import { v } from 'convex/values';

import { internalQuery, query } from '../../_generated/server';
import { requireAdmin } from '../auth/roles';
import {
  getMediaAdminEditPath,
  getMediaPublicPath,
  isUnnotifiedOpenCheck,
} from './digest';
import { isBrokenStatus } from './record';
import {
  mediaCheckEntityTable,
  mediaCheckState,
  mediaCheckStatus,
  mediaHealthDigestItem,
} from './validators';

const publishedMediaItem = v.object({
  entityId: v.string(),
  entityTable: mediaCheckEntityTable,
  mediaUrl: v.string(),
  slug: v.string(),
  speakerSlug: v.optional(v.string()),
  title: v.string(),
});

const openMediaCheckItem = v.object({
  _id: v.id('mediaChecks'),
  adminPath: v.string(),
  firstBrokenAt: v.number(),
  mediaUrl: v.string(),
  publicPath: v.union(v.null(), v.string()),
  status: v.union(v.literal('missing'), v.literal('private')),
  title: v.string(),
});

export const getMediaCheck = internalQuery({
  args: {
    entityId: v.string(),
    entityTable: mediaCheckEntityTable,
    mediaUrl: v.string(),
  },
  handler: async (ctx, args) =>
    await ctx.db
      .query('mediaChecks')
      .withIndex('by_entityTable_and_entityId_and_mediaUrl', (q) =>
        q
          .eq('entityTable', args.entityTable)
          .eq('entityId', args.entityId)
          .eq('mediaUrl', args.mediaUrl)
      )
      .unique(),
  returns: v.union(
    v.null(),
    v.object({
      _creationTime: v.number(),
      _id: v.id('mediaChecks'),
      checkedAt: v.number(),
      entityId: v.string(),
      entityTable: mediaCheckEntityTable,
      firstBrokenAt: v.optional(v.number()),
      lastNotifiedAt: v.optional(v.number()),
      lastNotifiedStatus: v.optional(mediaCheckStatus),
      mediaUrl: v.string(),
      state: v.optional(mediaCheckState),
      status: mediaCheckStatus,
    })
  ),
});

export const listPublishedMediaPage = internalQuery({
  args: {
    paginationOpts: paginationOptsValidator,
    source: mediaCheckEntityTable,
  },
  handler: async (ctx, args) => {
    const paginationOpts: PaginationOptions = args.paginationOpts;

    if (args.source === 'talks') {
      const result = await ctx.db
        .query('talks')
        .withIndex('by_status_and_publishedAt', (q) =>
          q.eq('status', 'published')
        )
        .paginate(paginationOpts);

      const page = await Promise.all(
        result.page.map(async (talk) => {
          const speaker = await ctx.db.get('speakers', talk.speakerId);

          return {
            entityId: talk._id,
            entityTable: 'talks' as const,
            mediaUrl: talk.mediaUrl,
            slug: talk.slug,
            speakerSlug: speaker?.slug,
            title: talk.title,
          };
        })
      );

      return {
        ...result,
        page,
      };
    }

    const result = await ctx.db
      .query('clips')
      .withIndex('by_status_and_publishedAt', (q) =>
        q.eq('status', 'published')
      )
      .paginate(paginationOpts);

    const page = await Promise.all(
      result.page.map(async (clip) => {
        const speaker = clip.speakerId
          ? await ctx.db.get('speakers', clip.speakerId)
          : null;

        return {
          entityId: clip._id,
          entityTable: 'clips' as const,
          mediaUrl: clip.mediaUrl,
          slug: clip.slug,
          speakerSlug: speaker?.slug,
          title: clip.title,
        };
      })
    );

    return {
      ...result,
      page,
    };
  },
  returns: paginationResultValidator(publishedMediaItem),
});

export const listDigestMediaChecks = internalQuery({
  args: {},
  handler: async (ctx) => {
    const checks = await ctx.db.query('mediaChecks').collect();
    const open = checks.filter(
      (check) =>
        (check.state === 'open' || check.state === undefined) &&
        isBrokenStatus(check.status)
    );
    const newChecks = open.filter((check) => isUnnotifiedOpenCheck(check));
    const enrichedResults = await Promise.all(
      newChecks.map(async (check) => {
        if (!isBrokenStatus(check.status)) {
          return null;
        }

        const entity = await loadMediaEntity(ctx, check);

        if (!entity) {
          return null;
        }

        return {
          adminPath: getMediaAdminEditPath(check.entityTable, check.entityId),
          checkId: check._id,
          entityTable: check.entityTable,
          firstBrokenAt: check.firstBrokenAt ?? check.checkedAt,
          mediaUrl: check.mediaUrl,
          newStatus: check.status,
          publicPath: getMediaPublicPath({
            entityTable: check.entityTable,
            slug: entity.slug,
            speakerSlug: entity.speakerSlug,
          }),
          title: entity.title,
        };
      })
    );
    const enriched = enrichedResults.filter(
      (item): item is NonNullable<typeof item> => item !== null
    );

    return {
      newCheckIds: enriched.map((item) => item.checkId),
      newItems: enriched.map((item) => ({
        adminPath: item.adminPath,
        entityTable: item.entityTable,
        firstBrokenAt: item.firstBrokenAt,
        mediaUrl: item.mediaUrl,
        newStatus: item.newStatus,
        publicPath: item.publicPath,
        title: item.title,
      })),
      stillOpenCount: Math.max(open.length - enriched.length, 0),
    };
  },
  returns: v.object({
    newCheckIds: v.array(v.id('mediaChecks')),
    newItems: v.array(mediaHealthDigestItem),
    stillOpenCount: v.number(),
  }),
});

export const listOpenMediaChecks = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const checks = await ctx.db
      .query('mediaChecks')
      .withIndex('by_state', (q) => q.eq('state', 'open'))
      .collect();

    const items = await Promise.all(
      checks.map(async (check) => await toOpenMediaCheckItem(ctx, check))
    );

    return items.filter(
      (item): item is NonNullable<typeof item> => item !== null
    );
  },
  returns: v.array(openMediaCheckItem),
});

async function toOpenMediaCheckItem(
  ctx: QueryCtx,
  check: {
    _id: Id<'mediaChecks'>;
    checkedAt: number;
    entityId: string;
    entityTable: 'clips' | 'talks';
    firstBrokenAt?: number;
    mediaUrl: string;
    status: 'missing' | 'ok' | 'private' | 'unknown';
  }
) {
  if (!isBrokenStatus(check.status)) {
    return null;
  }

  const entity = await loadMediaEntity(ctx, check);

  return {
    _id: check._id,
    adminPath: getMediaAdminEditPath(check.entityTable, check.entityId),
    firstBrokenAt: getOpenMediaFirstBrokenAt(check),
    mediaUrl: check.mediaUrl,
    publicPath: getOpenMediaPublicPath(check.entityTable, entity),
    status: check.status,
    title: getOpenMediaTitle(entity),
  };
}

function getOpenMediaFirstBrokenAt(check: {
  checkedAt: number;
  firstBrokenAt?: number;
}) {
  return check.firstBrokenAt ?? check.checkedAt;
}

function getOpenMediaTitle(
  entity: Awaited<ReturnType<typeof loadMediaEntity>>
) {
  return entity?.title ?? 'Untitled media';
}

function getOpenMediaPublicPath(
  entityTable: 'clips' | 'talks',
  entity: Awaited<ReturnType<typeof loadMediaEntity>>
) {
  if (!entity) {
    return null;
  }

  return getMediaPublicPath({
    entityTable,
    slug: entity.slug,
    speakerSlug: entity.speakerSlug,
  });
}

async function loadMediaEntity(
  ctx: QueryCtx,
  check: {
    entityId: string;
    entityTable: 'clips' | 'talks';
  }
) {
  if (check.entityTable === 'talks') {
    return await loadTalkMediaEntity(ctx, check.entityId);
  }

  return await loadClipMediaEntity(ctx, check.entityId);
}

async function loadTalkMediaEntity(ctx: QueryCtx, entityId: string) {
  const talk = await ctx.db.get('talks', entityId as Id<'talks'>);

  if (!talk) {
    return null;
  }

  const speaker = await ctx.db.get('speakers', talk.speakerId);

  return {
    slug: talk.slug,
    speakerSlug: speaker?.slug,
    title: talk.title,
  };
}

async function loadClipMediaEntity(ctx: QueryCtx, entityId: string) {
  const clip = await ctx.db.get('clips', entityId as Id<'clips'>);

  if (!clip) {
    return null;
  }

  const speaker = clip.speakerId
    ? await ctx.db.get('speakers', clip.speakerId)
    : null;

  return {
    slug: clip.slug,
    speakerSlug: speaker?.slug,
    title: clip.title,
  };
}
