import type { ActionCtx } from './_generated/server';
import type { MediaHealthDigestItem } from './model/mediaHealth/check/digest';

import { v } from 'convex/values';

import { internal } from './_generated/api';
import { internalAction } from './_generated/server';
import { reportSentryException } from './lib/sentry';
import { formatErrorMessage } from './lib/utils';
import {
  appendMediaHealthItem,
  buildMediaHealthDigest,
} from './model/mediaHealth/check/digest';
import { checkMediaUrl } from './model/mediaHealth/check/oembed';
import {
  mediaCheckEntityTable,
  mediaHealthDigestItemValidator,
} from './model/mediaHealth/validators';

const PAGE_SIZE = 40;

const continueCheckArgs = {
  items: v.array(mediaHealthDigestItemValidator),
  paginationCursor: v.union(v.null(), v.string()),
  source: mediaCheckEntityTable,
};

export {
  stampMediaChecksNotified,
  upsertMediaCheck,
} from './model/mediaHealth/mutations';
export { listPublishedMediaPage } from './model/mediaHealth/queries';

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

    const digestItems = await checkMediaPageItems(ctx, {
      items: args.items,
      pageItems: result.page,
    });
    const nextPage = nextMediaHealthPage(
      result,
      { source: args.source },
      digestItems
    );

    if (nextPage) {
      await ctx.scheduler.runAfter(
        0,
        internal.mediaHealth.continueCheck,
        nextPage
      );

      return;
    }

    await sendMediaHealthDigest(ctx, { items: digestItems });
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

async function sendMediaHealthDigest(
  ctx: ActionCtx,
  args: { items: MediaHealthDigestItem[] }
) {
  const digest = buildMediaHealthDigest(args.items);

  if (!digest) {
    return;
  }

  const sent = await ctx.runAction(internal.emails.sendMediaHealthEmail, {
    items: digest.items,
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
  args: {
    items: MediaHealthDigestItem[];
    pageItems: PublishedMediaItem[];
  }
): Promise<MediaHealthDigestItem[]> {
  if (args.pageItems.length === 0) {
    return args.items;
  }

  const [item] = args.pageItems;

  if (!item) {
    return args.items;
  }

  const nextItems = await checkPublishedMediaItem(ctx, {
    item,
    items: args.items,
  });

  return await checkMediaPageItems(ctx, {
    items: nextItems,
    pageItems: args.pageItems.slice(1),
  });
}

async function checkPublishedMediaItem(
  ctx: ActionCtx,
  args: {
    item: PublishedMediaItem;
    items: MediaHealthDigestItem[];
  }
): Promise<MediaHealthDigestItem[]> {
  const check = await checkMediaUrl(args.item.mediaUrl);

  if (check.skipped) {
    return args.items;
  }

  const outcome = await ctx.runMutation(internal.mediaHealth.upsertMediaCheck, {
    checkedAt: Date.now(),
    entityId: args.item.entityId,
    entityTable: args.item.entityTable,
    mediaUrl: args.item.mediaUrl,
    observedStatus: check.status,
  });

  return appendMediaHealthItem(args.item, outcome, args.items);
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
