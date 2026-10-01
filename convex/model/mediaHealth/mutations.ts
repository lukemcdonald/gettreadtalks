import type { Doc } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';
import type { MediaCheckStatus } from './validators';

import { v } from 'convex/values';

import { internalMutation } from '../../_generated/server';
import { decideMediaCheck } from './record';
import { mediaCheckEntityTable, mediaCheckStatus } from './validators';

export const upsertMediaCheck = internalMutation({
  args: {
    checkedAt: v.number(),
    entityId: v.string(),
    entityTable: mediaCheckEntityTable,
    mediaUrl: v.string(),
    observedStatus: mediaCheckStatus,
  },
  // fallow-ignore-next-line complexity
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
      existingStatus: existing?.status ?? null,
      observedStatus: args.observedStatus,
    });

    await writeMediaCheck(ctx, existing, args, decision.persistStatus);

    return {
      isTransition: decision.isTransition,
      persistStatus: decision.persistStatus,
      previousStatus: existing?.status ?? null,
    };
  },
  returns: v.object({
    isTransition: v.boolean(),
    persistStatus: mediaCheckStatus,
    previousStatus: v.union(mediaCheckStatus, v.null()),
  }),
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
  persistStatus: MediaCheckStatus
) {
  if (existing) {
    await ctx.db.patch(existing._id, {
      checkedAt: args.checkedAt,
      status: persistStatus,
    });

    return;
  }

  await ctx.db.insert('mediaChecks', {
    checkedAt: args.checkedAt,
    entityId: args.entityId,
    entityTable: args.entityTable,
    mediaUrl: args.mediaUrl,
    status: persistStatus,
  });
}
