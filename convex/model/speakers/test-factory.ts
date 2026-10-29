import type { MutationCtx } from '../../_generated/server';
import type { Infer } from 'convex/values';

import { v } from 'convex/values';

import { speakerFields } from './schema';

const speakerValidator = v.object(speakerFields);

type SpeakerFields = Infer<typeof speakerValidator>;

export function makeSpeaker(
  overrides: Partial<SpeakerFields> = {}
): SpeakerFields {
  return {
    firstName: 'John',
    lastName: 'Bunyan',
    slug: 'john-bunyan',
    ...overrides,
  };
}

export async function insertSpeaker(
  ctx: MutationCtx,
  overrides: Partial<SpeakerFields> = {}
) {
  return await ctx.db.insert('speakers', makeSpeaker(overrides));
}
