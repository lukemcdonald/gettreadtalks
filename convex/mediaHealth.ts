import type { ActionCtx } from './_generated/server';

import { v } from 'convex/values';

import { internal } from './_generated/api';
import { internalAction } from './_generated/server';
import { reportSentryException } from './lib/sentry';
import { getSiteUrl } from './lib/siteUrl';
import { formatErrorMessage } from './lib/utils';
import { buildMediaHealthDigest } from './model/mediaHealth/digest';
import { checkMediaUrl } from './model/mediaHealth/oembed';
import { mediaCheckEntityTable } from './model/mediaHealth/validators';

const PAGE_SIZE = 40;

const continueCheckArgs = {
  paginationCursor: v.union(v.null(), v.string()),
  source: mediaCheckEntityTable,
};

export {
  ignoreMediaCheck,
  resolveStaleMediaChecks,
  stampMediaChecksNotified,
  upsertMediaCheck,
} from './model/mediaHealth/mutations';
export {
  getMediaCheck,
  listDigestMediaChecks,
  listOpenMediaChecks,
  listPublishedMediaPage,
} from './model/mediaHealth/queries';

export const checkPublishedMedia = internalAction({
  args: {},
  handler: async (ctx) => {
    await runMediaHealthPage(ctx, {
      paginationCursor: null,
      source: 'talks',
    });

    return null;
  },
  returns: v.null(),
});

export const continueCheck = internalAction({
  args: continueCheckArgs,
  handler: async (ctx, args) => {
    await runMediaHealthPage(ctx, args);

    return null;
  },
  returns: v.null(),
});

async function runMediaHealthPage(
  ctx: ActionCtx,
  args: {
    paginationCursor: string | null;
    source: 'clips' | 'talks';
  }
) {
  try {
    const result = await ctx.runQuery(
      internal.mediaHealth.listPublishedMediaPage,
      {
        paginationOpts: {
          cursor: args.paginationCursor,
          numItems: PAGE_SIZE,
        },
        source: args.source,
      }
    );

    await checkMediaPageItems(ctx, result.page);
    const nextPage = nextMediaHealthPage(result, args);

    if (nextPage) {
      await ctx.scheduler.runAfter(
        0,
        internal.mediaHealth.continueCheck,
        nextPage
      );

      return;
    }

    await finishMediaHealthRun(ctx);
  } catch (error) {
    await reportSentryException({
      message: `Media health check failed: ${formatErrorMessage(error)}`,
      tags: { job: 'mediaHealth' },
    });
    throw error;
  }
}

interface PublishedMediaItem {
  entityId: string;
  entityTable: 'clips' | 'talks';
  mediaUrl: string;
  slug: string;
  speakerSlug?: string;
  title: string;
}

async function checkMediaPageItems(
  ctx: ActionCtx,
  pageItems: PublishedMediaItem[]
) {
  if (pageItems.length === 0) {
    return;
  }

  const [item] = pageItems;

  if (!item) {
    return;
  }

  await checkPublishedMediaItem(ctx, item);
  await checkMediaPageItems(ctx, pageItems.slice(1));
}

async function checkPublishedMediaItem(
  ctx: ActionCtx,
  item: PublishedMediaItem
) {
  const check = await checkMediaUrl(item.mediaUrl);

  if (check.skipped) {
    return;
  }

  await ctx.runMutation(internal.mediaHealth.upsertMediaCheck, {
    checkedAt: Date.now(),
    entityId: item.entityId,
    entityTable: item.entityTable,
    mediaUrl: item.mediaUrl,
    observedStatus: check.status,
  });
}

function nextMediaHealthPage(
  result: { continueCursor: string; isDone: boolean },
  args: {
    source: 'clips' | 'talks';
  }
) {
  if (!result.isDone) {
    return {
      paginationCursor: result.continueCursor,
      source: args.source,
    };
  }

  if (args.source === 'talks') {
    return {
      paginationCursor: null,
      source: 'clips' as const,
    };
  }

  return null;
}

async function finishMediaHealthRun(ctx: ActionCtx) {
  await ctx.runMutation(internal.mediaHealth.resolveStaleMediaChecks, {});

  const digestRows = await ctx.runQuery(
    internal.mediaHealth.listDigestMediaChecks,
    {}
  );
  const digest = buildMediaHealthDigest({
    newItems: digestRows.newItems,
    stillOpenCount: digestRows.stillOpenCount,
  });

  if (!digest) {
    return;
  }

  const siteUrl = getSiteUrl();

  const sent = await ctx.runAction(internal.emails.sendMediaHealthEmail, {
    items: digest.newItems,
    siteUrl,
    stillOpenCount: digest.stillOpenCount,
  });

  if (!sent || digestRows.newCheckIds.length === 0) {
    return;
  }

  await ctx.runMutation(internal.mediaHealth.stampMediaChecksNotified, {
    checkIds: digestRows.newCheckIds,
    notifiedAt: Date.now(),
  });
}
