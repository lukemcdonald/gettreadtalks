import type { Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';

export async function insertUserFavoriteTalk(
  ctx: MutationCtx,
  fields: {
    talkId: Id<'talks'>;
    userId: string;
  }
) {
  return await ctx.db.insert('userFavoriteTalks', fields);
}
