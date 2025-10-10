import type { Infer, ObjectType } from 'convex/values';

import * as validators from './validators';

export type CreateCollectionArgs = ObjectType<typeof validators.createCollectionArgs>;
export type CreateCollectionReturns = Infer<typeof validators.createCollectionReturns>;
export type DestroyCollectionArgs = ObjectType<typeof validators.destroyCollectionArgs>;
export type DestroyCollectionReturns = Infer<typeof validators.destroyCollectionReturns>;
export type GetCollectionArgs = ObjectType<typeof validators.getCollectionArgs>;
export type GetCollectionBySlugArgs = ObjectType<typeof validators.getCollectionBySlugArgs>;
export type GetCollectionBySlugReturns = Infer<typeof validators.getCollectionBySlugReturns>;
export type GetCollectionReturns = Infer<typeof validators.getCollectionReturns>;
export type GetCollectionsBySpeakerArgs = ObjectType<typeof validators.getCollectionsBySpeakerArgs>;
export type GetCollectionsBySpeakerReturns = Infer<typeof validators.getCollectionsBySpeakerReturns>;
export type GetCollectionsWithStatsArgs = ObjectType<typeof validators.getCollectionsWithStatsArgs>;
export type GetCollectionsWithStatsReturns = Infer<typeof validators.getCollectionsWithStatsReturns>;
export type GetCollectionWithSpeakersArgs = ObjectType<
  typeof validators.getCollectionWithSpeakersArgs
>;
export type GetCollectionWithSpeakersReturns = Infer<
  typeof validators.getCollectionWithSpeakersReturns
>;
export type GetCollectionWithTalksArgs = ObjectType<typeof validators.getCollectionWithTalksArgs>;
export type GetCollectionWithTalksReturns = Infer<typeof validators.getCollectionWithTalksReturns>;
export type ListCollectionsArgs = ObjectType<typeof validators.listCollectionsArgs>;
export type ListCollectionsReturns = Infer<typeof validators.listCollectionsReturns>;
export type UpdateCollectionArgs = ObjectType<typeof validators.updateCollectionArgs>;
export type UpdateCollectionReturns = Infer<typeof validators.updateCollectionReturns>;
