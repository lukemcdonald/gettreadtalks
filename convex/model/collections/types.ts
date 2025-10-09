import type { ObjectType } from 'convex/values';

import * as validators from './validators';

export type CreateCollectionArgs = ObjectType<typeof validators.createCollectionArgs>;
export type GetCollectionArgs = ObjectType<typeof validators.getCollectionArgs>;
export type GetCollectionBySlugArgs = ObjectType<typeof validators.getCollectionBySlugArgs>;
export type GetCollectionWithTalksArgs = ObjectType<typeof validators.getCollectionWithTalksArgs>;
export type ListCollectionsArgs = ObjectType<typeof validators.listCollectionsArgs>;
export type UpdateCollectionArgs = ObjectType<typeof validators.updateCollectionArgs>;
