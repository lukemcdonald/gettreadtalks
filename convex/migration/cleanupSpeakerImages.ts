import { v } from 'convex/values';

import { mutation } from '../_generated/server';

/**
 * Remove imageUrl from speakers that don't have corresponding image files.
 * This mutation accepts a list of speaker IDs to clean up.
 *
 * @param ctx - Database context
 * @param args - Cleanup arguments
 * @returns Summary of cleanup operation
 */
export const cleanupSpeakerImages = mutation({
  args: {
    speakerIds: v.array(v.id('speakers')),
  },
  returns: v.object({
    cleaned: v.number(),
    total: v.number(),
  }),
  handler: async (ctx, args) => {
    let cleaned = 0;

    for (const speakerId of args.speakerIds) {
      const speaker = await ctx.db.get(speakerId);

      if (!speaker) {
        continue;
      }

      if (speaker.imageUrl) {
        // Remove imageUrl by patching with undefined
        await ctx.db.patch(speakerId, {
          imageUrl: undefined,
          updatedAt: Date.now(),
        });
        cleaned += 1;
      }
    }

    return {
      cleaned,
      total: args.speakerIds.length,
    };
  },
});
