import type { Doc, Id } from '@/convex/_generated/dataModel';

export type Collection = Doc<'collections'>;
export type CollectionId = Id<'collections'>;

/** Collection fields used in selection/dropdown UIs */
export type CollectionListItem = Pick<Collection, '_id' | 'slug' | 'title'>;

/**
 * Type for collection data returned from getCollectionBySlug server function.
 * This includes the collection with its talks and speakers.
 */
export type CollectionData = NonNullable<
  Awaited<ReturnType<typeof import('./queries/get-collection-by-slug').getCollectionBySlug>>
>;
