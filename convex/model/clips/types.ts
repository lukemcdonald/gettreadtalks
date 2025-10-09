import type { Infer, ObjectType } from 'convex/values';

import * as validators from './validators';

export type CreateClipArgs = ObjectType<typeof validators.createClipArgs>;
export type CreateClipReturns = Infer<typeof validators.createClipReturns>;
export type GetClipBySlugWithRelationsArgs = ObjectType<
  typeof validators.getClipBySlugWithRelationsArgs
>;
export type GetClipBySlugWithRelationsReturns = Infer<
  typeof validators.getClipBySlugWithRelationsReturns
>;
export type GetPublishedClipsArgs = ObjectType<typeof validators.getPublishedClipsArgs>;
export type GetPublishedClipsReturns = Infer<typeof validators.getPublishedClipsReturns>;
export type UpdateClipStatusArgs = ObjectType<typeof validators.updateClipStatusArgs>;
export type UpdateClipStatusReturns = Infer<typeof validators.updateClipStatusReturns>;
