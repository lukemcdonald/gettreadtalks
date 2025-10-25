import { mutations, queries } from './model/clips';

// Queries
export const getClipBySlug = queries.getClipBySlugWithRelations;
export const listClips = queries.getClips;
export const listClipsBySpeaker = queries.getClipsBySpeaker;

// Mutations
export const archiveClip = mutations.archiveClip;
export const createClip = mutations.createClip;
export const updateClip = mutations.updateClip;
export const updateClipStatus = mutations.updateClipStatus;
