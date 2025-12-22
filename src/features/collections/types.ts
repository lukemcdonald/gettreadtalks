import type { Doc, Id } from '@/convex/_generated/dataModel';

export type Collection = Doc<'collections'>;
export type CollectionId = Id<'collections'>;

/**
 * Type for collection data returned from getCollectionBySlug server function.
 * This includes the collection with its talks and speakers.
 */
export type CollectionData = NonNullable<
  Awaited<ReturnType<typeof import('./queries').getCollectionBySlug>>
>;
