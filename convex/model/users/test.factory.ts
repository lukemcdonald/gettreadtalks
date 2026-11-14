import type { Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';

export async function insertUserFavoriteTalk(
  ctx: MutationCtx,
  args: {
    talkId: Id<'talks'>;
    userId: string;
  }
) {
  return await ctx.db.insert('userFavoriteTalks', {
    talkId: args.talkId,
    userId: args.userId,
  });
}
