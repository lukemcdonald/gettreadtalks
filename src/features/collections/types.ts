import type { FunctionReturnType } from 'convex/server';
import type { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';

export type Collection = Doc<'collections'>;
export type CollectionId = Id<'collections'>;

/** Collection fields used in selection/dropdown UIs */
export type CollectionListItem = Pick<Collection, '_id' | 'slug' | 'title'>;

/** Collection with talks and speakers from getCollectionBySlug. */
export type CollectionData = NonNullable<
  FunctionReturnType<typeof api.collections.getCollectionBySlug>
>;
