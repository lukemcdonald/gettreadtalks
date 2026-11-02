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
    const checkId = await writeMediaCheck(ctx, existing, args, decision);

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
  args: {
    entityId: string;
    entityTable: 'clips' | 'talks';
    mediaUrl: string;
  }
) {
  const exact = await loadMediaCheckByEntityUrl(ctx, args);

  if (exact) {
    return exact;
  }

  return await ctx.db
    .query('mediaChecks')
    .withIndex('by_entityTable_and_entityId_and_mediaUrl', (q) =>
      q.eq('entityTable', args.entityTable).eq('entityId', args.entityId)
    )
    .first();
}

async function writeMediaCheck(
  ctx: MutationCtx,
  existing: Doc<'mediaChecks'> | null,
  args: {
    checkedAt: number;
    entityId: string;
    entityTable: 'clips' | 'talks';
    mediaUrl: string;
  },
  decision: {
    firstBrokenAt?: number;
    lastNotifiedAt?: number;
    persistStatus: MediaCheckStatus;
  }
) {
  const fields = {
    checkedAt: args.checkedAt,
    entityId: args.entityId,
    entityTable: args.entityTable,
    mediaUrl: args.mediaUrl,
    status: decision.persistStatus,
    ...(decision.firstBrokenAt === undefined
      ? {}
      : { firstBrokenAt: decision.firstBrokenAt }),
    ...(decision.lastNotifiedAt === undefined
      ? {}
      : { lastNotifiedAt: decision.lastNotifiedAt }),
  };

  if (existing) {
    await ctx.db.replace(existing._id, fields);

    return existing._id;
  }

  return await ctx.db.insert('mediaChecks', fields);
}
