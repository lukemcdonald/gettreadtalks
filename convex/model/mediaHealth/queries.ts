import type { MutationCtx, QueryCtx } from '../../_generated/server';
import type { PaginationOptions } from 'convex/server';

import {
  paginationOptsValidator,
  paginationResultValidator,
} from 'convex/server';
import { v } from 'convex/values';

import { internalQuery } from '../../_generated/server';
import { mediaCheckEntityTable } from './validators';

const publishedMediaItemValidator = v.object({
  entityId: v.string(),
  entityTable: mediaCheckEntityTable,
  mediaUrl: v.string(),
  slug: v.string(),
  speakerSlug: v.optional(v.string()),
  title: v.string(),
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
  returns: paginationResultValidator(publishedMediaItemValidator),
});

export function loadMediaCheckByEntityUrl(
  ctx: MutationCtx | QueryCtx,
  {
    entityId,
    entityTable,
    mediaUrl,
  }: {
    entityId: string;
    entityTable: 'clips' | 'talks';
    mediaUrl: string;
  }
) {
  return ctx.db
    .query('mediaChecks')
    .withIndex('by_entityTable_and_entityId_and_mediaUrl', (q) =>
      q
        .eq('entityTable', entityTable)
        .eq('entityId', entityId)
        .eq('mediaUrl', mediaUrl)
    )
    .unique();
}
