import type { MutationCtx } from '../../_generated/server';

import { deleteAll } from '../../lib/utils';

export function shouldClearMediaChecks(args: {
  mediaUrlChanged: boolean;
  published: boolean;
}) {
  return args.mediaUrlChanged || !args.published;
}

export async function clearMediaChecksForEntity(
  ctx: MutationCtx,
  args: {
    entityId: string;
    entityTable: 'clips' | 'talks';
  }
) {
  const rows = await ctx.db
    .query('mediaChecks')
    .withIndex('by_entityTable_and_entityId_and_mediaUrl', (q) =>
      q.eq('entityTable', args.entityTable).eq('entityId', args.entityId)
    )
    .collect();

  await deleteAll(ctx, rows);
}

export async function clearStaleMediaChecks(
  ctx: MutationCtx,
  args: {
    entityId: string;
    entityTable: 'clips' | 'talks';
    nextMediaUrl?: string;
    nextStatus?: string;
    previousMediaUrl: string;
    previousStatus: string;
  }
) {
  if (
    !shouldClearMediaChecks({
      mediaUrlChanged:
        args.nextMediaUrl !== undefined &&
        args.nextMediaUrl !== args.previousMediaUrl,
      published: (args.nextStatus ?? args.previousStatus) === 'published',
    })
  ) {
    return;
  }

  await clearMediaChecksForEntity(ctx, {
    entityId: args.entityId,
    entityTable: args.entityTable,
  });
}
