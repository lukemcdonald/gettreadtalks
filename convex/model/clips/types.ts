import type { Infer, ObjectType } from 'convex/values';

import * as validators from './validators';

export type CreateClipArgs = ObjectType<typeof validators.createClipArgs>;
export type CreateClipReturns = Infer<typeof validators.createClipReturns>;
export type DeleteClipArgs = ObjectType<typeof validators.deleteClipArgs>;
export type DeleteClipReturns = Infer<typeof validators.deleteClipReturns>;
export type GetClipBySlugWithRelationsArgs = ObjectType<
  typeof validators.getClipBySlugWithRelationsArgs
>;
export type GetClipBySlugWithRelationsReturns = Infer<
  typeof validators.getClipBySlugWithRelationsReturns
>;
export type GetClipsBySpeakerArgs = ObjectType<typeof validators.getClipsBySpeakerArgs>;
export type GetClipsBySpeakerReturns = Infer<typeof validators.getClipsBySpeakerReturns>;
export type ListClipsArgs = ObjectType<typeof validators.listClipsArgs>;
export type ListClipsReturns = Infer<typeof validators.listClipsReturns>;
export type UpdateClipArgs = ObjectType<typeof validators.updateClipArgs>;
export type UpdateClipReturns = Infer<typeof validators.updateClipReturns>;
export type UpdateClipStatusArgs = ObjectType<typeof validators.updateClipStatusArgs>;
export type UpdateClipStatusReturns = Infer<typeof validators.updateClipStatusReturns>;
