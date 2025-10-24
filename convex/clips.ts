import { mutations, queries } from './model/clips';

export const archive = mutations.archiveClip;
export const create = mutations.createClip;
export const getBySlug = queries.getClipBySlugWithRelations;
export const list = queries.getClips;
export const listBySpeaker = queries.getClipsBySpeaker;
export const update = mutations.updateClip;
export const updateStatus = mutations.updateClipStatus;
