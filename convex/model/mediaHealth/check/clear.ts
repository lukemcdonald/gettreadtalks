import type { MutationCtx } from '../../../_generated/server';
import type { MediaCheckKey } from '../validators';

import { deleteAll } from '../../../lib/utils';

export function shouldClearMediaChecks(args: {
  mediaUrlChanged: boolean;
  published: boolean;
}) {
  return args.mediaUrlChanged || !args.published;
}

export async function clearMediaChecksForEntity(
  ctx: MutationCtx,
  args: Pick<MediaCheckKey, 'entityId' | 'entityTable'>
) {
  const rows = await ctx.db
    .query('mediaChecks')
    .withIndex('by_entityTable_and_entityId_and_mediaUrl', (q) =>
      q.eq('entityTable', args.entityTable).eq('entityId', args.entityId)
    )
    .collect();

  await deleteAll(ctx, { items: rows });
}

export async function clearStaleMediaChecks(
  ctx: MutationCtx,
  args: Pick<MediaCheckKey, 'entityId' | 'entityTable'> & {
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
