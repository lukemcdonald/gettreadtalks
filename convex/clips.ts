import { mutations, queries } from './model/clips';

// Queries
export const {
  getClip,
  getClipBySlug,
  listAllClips,
  listClipSlugs,
  listClips,
} = queries;

// Mutations
export const { archiveClip, createClip, destroyClip, updateClip } = mutations;
