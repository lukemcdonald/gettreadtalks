import type { MutationCtx } from '../../../_generated/server';

import { deleteAll } from '../../../lib/utils';

export function shouldClearMediaChecks(args: {
  mediaUrlChanged: boolean;
  published: boolean;
}) {
  return args.mediaUrlChanged || !args.published;
}

export async function clearMediaChecksForEntity(
  ctx: MutationCtx,
  {
    entityId,
    entityTable,
  }: {
    entityId: string;
    entityTable: 'clips' | 'talks';
  }
) {
  const rows = await ctx.db
    .query('mediaChecks')
    .withIndex('by_entityTable_and_entityId_and_mediaUrl', (q) =>
      q.eq('entityTable', entityTable).eq('entityId', entityId)
    )
    .collect();

  await deleteAll(ctx, { items: rows });
}

export async function clearStaleMediaChecks(
  ctx: MutationCtx,
  {
    entityId,
    entityTable,
    nextMediaUrl,
    nextStatus,
    previousMediaUrl,
    previousStatus,
  }: {
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
        nextMediaUrl !== undefined && nextMediaUrl !== previousMediaUrl,
      published: (nextStatus ?? previousStatus) === 'published',
    })
  ) {
    return;
  }

  await clearMediaChecksForEntity(ctx, {
    entityId,
    entityTable,
  });
}
