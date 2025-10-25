import { mutations, queries } from './model/clips';

// Queries
export const getClipBySlug = queries.getClipBySlugWithRelations;
export const listClips = queries.listClips;
export const listClipsBySpeaker = queries.listClipsBySpeaker;

// Mutations
export const archiveClip = mutations.archiveClip;
export const createClip = mutations.createClip;
export const updateClip = mutations.updateClip;
export const updateClipStatus = mutations.updateClipStatus;
