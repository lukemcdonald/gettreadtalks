import type { MutationCtx } from '../../_generated/server';
import type { Infer } from 'convex/values';

import { v } from 'convex/values';

import { collectionFields } from './schema';

const collectionValidator = v.object(collectionFields);

type CollectionFields = Infer<typeof collectionValidator>;

export function makeCollection(
  overrides: Partial<CollectionFields> = {}
): CollectionFields {
  return {
    slug: 'a-collection',
    title: 'A collection',
    ...overrides,
  };
}

export async function insertCollection(
  ctx: MutationCtx,
  overrides: Partial<CollectionFields> = {}
) {
  return await ctx.db.insert('collections', makeCollection(overrides));
}
