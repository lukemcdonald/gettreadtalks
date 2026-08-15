import { mutations, queries } from './model/clips';

// Queries
export const {
  getClip,
  getClipBySlug,
  listAllClips,
  listClipSlugsForSitemap,
  listClips,
  listClipsBySpeaker,
} = queries;

// Mutations
export const { archiveClip, createClip, destroyClip, updateClip } = mutations;
