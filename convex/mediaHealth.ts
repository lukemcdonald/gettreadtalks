import type { ActionCtx } from './_generated/server';
import type { MediaHealthTransition } from './model/mediaHealth/digest';
import type { MediaCheckStatus } from './model/mediaHealth/validators';

import { v } from 'convex/values';

import { internal } from './_generated/api';
import { internalAction } from './_generated/server';
import { reportSentryException } from './lib/sentry';
import { getErrorMessage } from './lib/utils';
import {
  appendMediaHealthTransition,
  buildMediaHealthDigest,
} from './model/mediaHealth/digest';
import { checkMediaUrl } from './model/mediaHealth/oembed';
import {
  mediaCheckEntityTable,
  mediaCheckStatus,
} from './model/mediaHealth/validators';

const PAGE_SIZE = 40;

const mediaHealthTransition = v.object({
  adminPath: v.string(),
  entityTable: mediaCheckEntityTable,
  mediaUrl: v.string(),
  newStatus: v.union(v.literal('missing'), v.literal('private')),
  previousStatus: mediaCheckStatus,
  title: v.string(),
});

const continueCheckArgs = {
  paginationCursor: v.union(v.null(), v.string()),
  source: mediaCheckEntityTable,
  transitions: v.array(mediaHealthTransition),
};

export { upsertMediaCheck } from './model/mediaHealth/mutations';
export {
  getMediaCheck,
  listPublishedMediaPage,
} from './model/mediaHealth/queries';

export const checkPublishedMedia = internalAction({
  args: {},
  handler: async (ctx) => {
    await runMediaHealthPage(ctx, {
      paginationCursor: null,
      source: 'talks',
      transitions: [],
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
    transitions: MediaHealthTransition[];
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

    const transitions = await checkMediaPageItems(
      ctx,
      result.page,
      args.transitions
    );
    const nextPage = nextMediaHealthPage(result, args, transitions);

    if (nextPage) {
      await ctx.scheduler.runAfter(
        0,
        internal.mediaHealth.continueCheck,
        nextPage
      );

      return;
    }

    const digest = buildMediaHealthDigest(transitions);

    if (!digest) {
      return;
    }

    await ctx.runAction(internal.emails.sendMediaHealthEmail, {
      items: digest,
    });
  } catch (error) {
    await reportSentryException({
      message: `Media health check failed: ${getErrorMessage(error)}`,
      tags: { job: 'mediaHealth' },
    });
    throw error;
  }
}

interface PublishedMediaItem {
  entityId: string;
  entityTable: 'clips' | 'talks';
  mediaUrl: string;
  title: string;
}

async function checkMediaPageItems(
  ctx: ActionCtx,
  items: PublishedMediaItem[],
  transitions: MediaHealthTransition[]
): Promise<MediaHealthTransition[]> {
  if (items.length === 0) {
    return transitions;
  }

  const [item] = items;

  if (!item) {
    return transitions;
  }

  const nextTransitions = await checkPublishedMediaItem(ctx, item, transitions);

  return await checkMediaPageItems(ctx, items.slice(1), nextTransitions);
}

async function checkPublishedMediaItem(
  ctx: ActionCtx,
  item: PublishedMediaItem,
  transitions: MediaHealthTransition[]
): Promise<MediaHealthTransition[]> {
  const check = await checkMediaUrl(item.mediaUrl);

  if (check.skipped) {
    return transitions;
  }

  const outcome: {
    isTransition: boolean;
    persistStatus: MediaCheckStatus;
    previousStatus: MediaCheckStatus | null;
  } = await ctx.runMutation(internal.mediaHealth.upsertMediaCheck, {
    checkedAt: Date.now(),
    entityId: item.entityId,
    entityTable: item.entityTable,
    mediaUrl: item.mediaUrl,
    observedStatus: check.status,
  });

  return appendMediaHealthTransition(item, outcome, transitions);
}

function nextMediaHealthPage(
  result: { continueCursor: string; isDone: boolean },
  args: {
    source: 'clips' | 'talks';
    transitions: MediaHealthTransition[];
  },
  transitions: MediaHealthTransition[]
) {
  if (!result.isDone) {
    return {
      paginationCursor: result.continueCursor,
      source: args.source,
      transitions,
    };
  }

  if (args.source === 'talks') {
    return {
      paginationCursor: null,
      source: 'clips' as const,
      transitions,
    };
  }

  return null;
}
