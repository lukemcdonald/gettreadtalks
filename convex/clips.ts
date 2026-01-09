import { mutations, queries } from './model/clips';

// Queries
export const getClipBySlug = queries.getClipBySlug;
export const listClips = queries.listClips;
export const listClipsBySpeaker = queries.listClipsBySpeaker;
export const listClipsWithSpeakers = queries.listClipsWithSpeakers;
export const listClipsWithSpeakersAndPublishedTalks =
  queries.listClipsWithSpeakersAndPublishedTalks;

// Mutations
export const archiveClip = mutations.archiveClip;
export const createClip = mutations.createClip;
export const updateClip = mutations.updateClip;
export const updateClipStatus = mutations.updateClipStatus;
