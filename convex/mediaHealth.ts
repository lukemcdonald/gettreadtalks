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
  {
    items,
    paginationCursor,
    source,
  }: {
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
          cursor: paginationCursor,
          numItems: PAGE_SIZE,
        },
        source,
      }
    );

    const digestItems = await checkMediaPageItems(ctx, {
      items,
      pageItems: result.page,
    });
    const nextPage = nextMediaHealthPage(result, { source }, digestItems);

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
  { items }: { items: MediaHealthDigestItem[] }
) {
  const digest = buildMediaHealthDigest(items);

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
  {
    items,
    pageItems,
  }: {
    items: MediaHealthDigestItem[];
    pageItems: PublishedMediaItem[];
  }
): Promise<MediaHealthDigestItem[]> {
  if (pageItems.length === 0) {
    return items;
  }

  const [item] = pageItems;

  if (!item) {
    return items;
  }

  const nextItems = await checkPublishedMediaItem(ctx, {
    item,
    items,
  });

  return await checkMediaPageItems(ctx, {
    items: nextItems,
    pageItems: pageItems.slice(1),
  });
}

async function checkPublishedMediaItem(
  ctx: ActionCtx,
  {
    item,
    items,
  }: {
    item: PublishedMediaItem;
    items: MediaHealthDigestItem[];
  }
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
