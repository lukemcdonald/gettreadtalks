import type { MutationCtx } from '../../_generated/server';
import type { Infer } from 'convex/values';

import { v } from 'convex/values';

import { clipFields } from './schema';

const MEDIA_URL = 'https://www.youtube.com/watch?v=0SVTl4Xa5fY';

const clipValidator = v.object(clipFields);

type ClipFields = Infer<typeof clipValidator>;

export function makeClip(overrides: Partial<ClipFields> = {}): ClipFields {
  return {
    mediaUrl: MEDIA_URL,
    slug: 'a-clip',
    status: 'published',
    title: 'A clip',
    ...overrides,
  };
}

export async function insertClip(
  ctx: MutationCtx,
  overrides: Partial<ClipFields> = {}
) {
  return await ctx.db.insert('clips', makeClip(overrides));
}
