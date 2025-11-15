/**
 * Type for collection data returned from getCollectionBySlug server function.
 * This includes the collection with its talks and speakers.
 */
export type CollectionData = NonNullable<
  Awaited<ReturnType<typeof import('./server').getCollectionBySlug>>
>;

/**
 * Type for a talk with speaker from collection queries.
 */
export type TalkWithSpeaker = CollectionData['talks'][number];
