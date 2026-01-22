import { mutations, queries } from './model/clips';

// Queries
export const getClip = queries.getClip;
export const getClipBySlug = queries.getClipBySlug;
export const listAllClips = queries.listAllClips;
export const listClips = queries.listClips;
export const listClipsBySpeaker = queries.listClipsBySpeaker;

// Mutations
export const archiveClip = mutations.archiveClip;
export const createClip = mutations.createClip;
export const updateClip = mutations.updateClip;
export const updateClipStatus = mutations.updateClipStatus;
