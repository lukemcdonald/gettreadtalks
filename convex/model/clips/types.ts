import type { Infer, ObjectType } from 'convex/values';
import type * as validators from './validators';

export type CreateClipArgs = ObjectType<typeof validators.createClipArgs>;
export type CreateClipReturns = Infer<typeof validators.createClipReturns>;
export type ArchiveClipArgs = ObjectType<typeof validators.archiveClipArgs>;
export type ArchiveClipReturns = Infer<typeof validators.archiveClipReturns>;
export type GetClipBySlugWithRelationsArgs = ObjectType<
  typeof validators.getClipBySlugWithRelationsArgs
>;
export type GetClipBySlugWithRelationsReturns = Infer<
  typeof validators.getClipBySlugWithRelationsReturns
>;
export type ListBySpeakerArgs = ObjectType<typeof validators.listBySpeakerArgs>;
export type ListBySpeakerReturns = Infer<typeof validators.listBySpeakerReturns>;
export type ListClipsArgs = ObjectType<typeof validators.listClipsArgs>;
export type ListClipsReturns = Infer<typeof validators.listClipsReturns>;
export type UpdateClipArgs = ObjectType<typeof validators.updateClipArgs>;
export type UpdateClipReturns = Infer<typeof validators.updateClipReturns>;
export type UpdateClipStatusArgs = ObjectType<typeof validators.updateClipStatusArgs>;
export type UpdateClipStatusReturns = Infer<typeof validators.updateClipStatusReturns>;
