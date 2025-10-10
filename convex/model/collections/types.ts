import type { Infer, ObjectType } from 'convex/values';

import * as validators from './validators';

export type CreateCollectionArgs = ObjectType<typeof validators.createCollectionArgs>;
export type CreateCollectionReturns = Infer<typeof validators.createCollectionReturns>;
export type DeleteCollectionArgs = ObjectType<typeof validators.deleteCollectionArgs>;
export type DeleteCollectionReturns = Infer<typeof validators.deleteCollectionReturns>;
export type GetCollectionArgs = ObjectType<typeof validators.getCollectionArgs>;
export type GetCollectionBySlugArgs = ObjectType<typeof validators.getCollectionBySlugArgs>;
export type GetCollectionBySlugReturns = Infer<typeof validators.getCollectionBySlugReturns>;
export type GetCollectionReturns = Infer<typeof validators.getCollectionReturns>;
export type GetCollectionWithTalksArgs = ObjectType<typeof validators.getCollectionWithTalksArgs>;
export type GetCollectionWithTalksReturns = Infer<typeof validators.getCollectionWithTalksReturns>;
export type ListCollectionsArgs = ObjectType<typeof validators.listCollectionsArgs>;
export type ListCollectionsReturns = Infer<typeof validators.listCollectionsReturns>;
export type UpdateCollectionArgs = ObjectType<typeof validators.updateCollectionArgs>;
export type UpdateCollectionReturns = Infer<typeof validators.updateCollectionReturns>;
