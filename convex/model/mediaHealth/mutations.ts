import type { Doc } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';
import type { MediaCheckStatus } from './validators';

import { v } from 'convex/values';

import { internalMutation } from '../../_generated/server';
import { decideMediaCheck } from './check/record';
import { loadMediaCheckByEntityUrl } from './queries';
import { mediaCheckEntityTable, mediaCheckStatus } from './validators';

export const upsertMediaCheck = internalMutation({
  args: {
    checkedAt: v.number(),
    entityId: v.string(),
    entityTable: mediaCheckEntityTable,
    mediaUrl: v.string(),
    observedStatus: mediaCheckStatus,
  },
  handler: async (ctx, args) => {
    const existing = await loadExistingCheck(ctx, args);
    const sameUrl = existing?.mediaUrl === args.mediaUrl;
    const decision = decideMediaCheck({
      checkedAt: args.checkedAt,
      existing: sameUrl ? existing : null,
      observedStatus: args.observedStatus,
    });
    const checkId = await writeMediaCheck(ctx, {
      ...args,
      ...decision,
      existing,
    });

    return {
      checkId,
      firstBrokenAt: decision.firstBrokenAt,
      lastNotifiedAt: decision.lastNotifiedAt,
      persistStatus: decision.persistStatus,
    };
  },
  returns: v.object({
    checkId: v.id('mediaChecks'),
    firstBrokenAt: v.optional(v.number()),
    lastNotifiedAt: v.optional(v.number()),
    persistStatus: mediaCheckStatus,
  }),
});

export const stampMediaChecksNotified = internalMutation({
  args: {
    checkIds: v.array(v.id('mediaChecks')),
    notifiedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await Promise.all(
      args.checkIds.map((checkId) =>
        ctx.db.patch(checkId, { lastNotifiedAt: args.notifiedAt })
      )
    );

    return null;
  },
  returns: v.null(),
});

async function loadExistingCheck(
  ctx: MutationCtx,
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
  const exact = await loadMediaCheckByEntityUrl(ctx, {
    entityId,
    entityTable,
    mediaUrl,
  });

  if (exact) {
    return exact;
  }

  return await ctx.db
    .query('mediaChecks')
    .withIndex('by_entityTable_and_entityId_and_mediaUrl', (q) =>
      q.eq('entityTable', entityTable).eq('entityId', entityId)
    )
    .first();
}

async function writeMediaCheck(
  ctx: MutationCtx,
  {
    checkedAt,
    entityId,
    entityTable,
    existing,
    firstBrokenAt,
    lastNotifiedAt,
    mediaUrl,
    persistStatus,
  }: {
    checkedAt: number;
    entityId: string;
    entityTable: 'clips' | 'talks';
    existing: Doc<'mediaChecks'> | null;
    firstBrokenAt?: number;
    lastNotifiedAt?: number;
    mediaUrl: string;
    persistStatus: MediaCheckStatus;
  }
) {
  const fields = {
    checkedAt,
    entityId,
    entityTable,
    mediaUrl,
    status: persistStatus,
    ...(firstBrokenAt === undefined ? {} : { firstBrokenAt }),
    ...(lastNotifiedAt === undefined ? {} : { lastNotifiedAt }),
  };

  if (existing) {
    await ctx.db.replace(existing._id, fields);

    return existing._id;
  }

  return await ctx.db.insert('mediaChecks', fields);
}
