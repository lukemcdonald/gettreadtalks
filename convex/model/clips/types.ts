import type { ObjectType } from 'convex/values';

import * as validators from './validators';

export type CreateClipArgs = ObjectType<typeof validators.createClipArgs>;
export type GetClipBySlugWithRelationsArgs = ObjectType<
  typeof validators.getClipBySlugWithRelationsArgs
>;
export type GetPublishedClipsArgs = ObjectType<typeof validators.getPublishedClipsArgs>;
export type UpdateClipStatusArgs = ObjectType<typeof validators.updateClipStatusArgs>;
