import type { FunctionReturnType } from 'convex/server';
import type { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';

export type Collection = Doc<'collections'>;
export type CollectionId = Id<'collections'>;
export type CollectionListItem = Pick<Collection, '_id' | 'slug' | 'title'>;
export type CollectionData = NonNullable<
  FunctionReturnType<typeof api.collections.getCollectionBySlug>
>;
