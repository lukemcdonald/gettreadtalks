import type { ActionCtx } from './_generated/server';
import type { MediaHealthDigestItem } from './model/mediaHealth/digest';

import { v } from 'convex/values';

import { internal } from './_generated/api';
import { internalAction } from './_generated/server';
import { reportSentryException } from './lib/sentry';
import { formatErrorMessage } from './lib/utils';
import {
  appendMediaHealthItem,
  buildMediaHealthDigest,
} from './model/mediaHealth/digest';
import { checkMediaUrl } from './model/mediaHealth/oembed';
import {
  mediaCheckEntityTable,
  mediaHealthDigestItem,
} from './model/mediaHealth/validators';

const PAGE_SIZE = 40;

const continueCheckArgs = {
  items: v.array(mediaHealthDigestItem),
  paginationCursor: v.union(v.null(), v.string()),
  source: mediaCheckEntityTable,
};

export {
  stampMediaChecksNotified,
  upsertMediaCheck,
} from './model/mediaHealth/mutations';
export {
  getMediaCheck,
  listPublishedMediaPage,
} from './model/mediaHealth/queries';

export const checkPublishedMedia = internalAction({
  args: {},
  handler: async (ctx) => {
    await runMediaHealthPage(ctx, {
      items: [],
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
    items: MediaHealthDigestItem[];
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

    const items = await checkMediaPageItems(ctx, result.page, args.items);
    const nextPage = nextMediaHealthPage(result, args, items);

    if (nextPage) {
      await ctx.scheduler.runAfter(
        0,
        internal.mediaHealth.continueCheck,
        nextPage
      );

      return;
    }

    await sendNewBreakDigest(ctx, items);
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

async function sendNewBreakDigest(
  ctx: ActionCtx,
  items: MediaHealthDigestItem[]
) {
  const digest = buildMediaHealthDigest(items);

  if (!digest) {
    return;
  }

  const sent = await ctx.runAction(internal.emails.sendMediaHealthEmail, {
    items: digest.items,
    stillBrokenCount: digest.stillBrokenCount,
  });

  if (!sent) {
    return;
  }

  await ctx.runMutation(internal.mediaHealth.stampMediaChecksNotified, {
    checkIds: digest.items.map((item) => item.checkId),
    notifiedAt: Date.now(),
  });
}

async function checkMediaPageItems(
  ctx: ActionCtx,
  pageItems: PublishedMediaItem[],
  items: MediaHealthDigestItem[]
): Promise<MediaHealthDigestItem[]> {
  if (pageItems.length === 0) {
    return items;
  }

  const [item] = pageItems;

  if (!item) {
    return items;
  }

  const nextItems = await checkPublishedMediaItem(ctx, item, items);

  return await checkMediaPageItems(ctx, pageItems.slice(1), nextItems);
}

async function checkPublishedMediaItem(
  ctx: ActionCtx,
  item: PublishedMediaItem,
  items: MediaHealthDigestItem[]
): Promise<MediaHealthDigestItem[]> {
  const check = await checkMediaUrl(item.mediaUrl);

  if (check.skipped) {
    return items;
  }

  const outcome = await ctx.runMutation(internal.mediaHealth.upsertMediaCheck, {
    checkedAt: Date.now(),
    entityId: item.entityId,
    entityTable: item.entityTable,
    mediaUrl: item.mediaUrl,
    observedStatus: check.status,
  });

  return appendMediaHealthItem(item, outcome, items);
}

function nextMediaHealthPage(
  result: { continueCursor: string; isDone: boolean },
  args: {
    source: 'clips' | 'talks';
  },
  items: MediaHealthDigestItem[]
) {
  if (!result.isDone) {
    return {
      items,
      paginationCursor: result.continueCursor,
      source: args.source,
    };
  }

  if (args.source === 'talks') {
    return {
      items,
      paginationCursor: null,
      source: 'clips' as const,
    };
  }

  return null;
}
