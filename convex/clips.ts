import { mutations, queries } from './model/clips';

// Queries
export const {
  getClip,
  getClipBySlug,
  listAllClips,
  listClips,
  listClipsBySpeaker,
  listPublishedClips,
} = queries;

// Mutations
export const { archiveClip, createClip, destroyClip, updateClip } = mutations;
