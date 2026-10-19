import type { Doc, Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';
import type { MediaCheckState } from './validators';

import { v } from 'convex/values';

import { internalMutation, mutation } from '../../_generated/server';
import { throwNotFound } from '../../lib/errors';
import { requireAdmin } from '../auth/roles';
import { decideMediaCheck, isBrokenStatus } from './record';
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
    const existing = await ctx.db
      .query('mediaChecks')
      .withIndex('by_entityTable_and_entityId_and_mediaUrl', (q) =>
        q
          .eq('entityTable', args.entityTable)
          .eq('entityId', args.entityId)
          .eq('mediaUrl', args.mediaUrl)
      )
      .unique();

    const decision = decideMediaCheck({
      checkedAt: args.checkedAt,
      existing: existing
        ? {
            firstBrokenAt: existing.firstBrokenAt,
            lastNotifiedAt: existing.lastNotifiedAt,
            state: existing.state,
            status: existing.status,
          }
        : null,
      observedStatus: args.observedStatus,
    });

    await writeMediaCheck(ctx, existing, args, decision);

    return null;
  },
  returns: v.null(),
});

export const resolveStaleMediaChecks = internalMutation({
  args: {},
  handler: async (ctx) => {
    const checks = await ctx.db.query('mediaChecks').collect();
    const stale = checks.filter(
      (check) => isOpenLike(check) || check.state === 'ignored'
    );

    await Promise.all(
      stale.map(async (check) => {
        if (await isCurrentPublishedUrl(ctx, check)) {
          return;
        }

        await ctx.db.patch(check._id, { state: 'resolved' });
      })
    );

    return null;
  },
  returns: v.null(),
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

export const ignoreMediaCheck = mutation({
  args: {
    mediaCheckId: v.id('mediaChecks'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const check = await ctx.db.get('mediaChecks', args.mediaCheckId);

    if (!check) {
      throwNotFound('Media check not found', {
        resource: 'mediaChecks',
        resourceId: args.mediaCheckId,
      });
    }

    await ctx.db.patch(check._id, { state: 'ignored' });

    return null;
  },
  returns: v.null(),
});

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
    persistStatus: Doc<'mediaChecks'>['status'];
    state: MediaCheckState;
  }
) {
  const fields = {
    checkedAt: args.checkedAt,
    state: decision.state,
    status: decision.persistStatus,
    ...(decision.firstBrokenAt === undefined
      ? {}
      : { firstBrokenAt: decision.firstBrokenAt }),
    ...(decision.lastNotifiedAt === undefined
      ? {}
      : { lastNotifiedAt: decision.lastNotifiedAt }),
  };

  if (existing) {
    await ctx.db.patch(existing._id, fields);

    return;
  }

  await ctx.db.insert('mediaChecks', {
    entityId: args.entityId,
    entityTable: args.entityTable,
    mediaUrl: args.mediaUrl,
    ...fields,
  });
}

function isOpenLike(check: Doc<'mediaChecks'>) {
  return (
    check.state === 'open' ||
    (check.state === undefined && isBrokenStatus(check.status))
  );
}

async function isCurrentPublishedUrl(
  ctx: MutationCtx,
  check: Doc<'mediaChecks'>
) {
  const entity =
    check.entityTable === 'talks'
      ? await ctx.db.get('talks', check.entityId as Id<'talks'>)
      : await ctx.db.get('clips', check.entityId as Id<'clips'>);

  return entity?.status === 'published' && entity.mediaUrl === check.mediaUrl;
}
