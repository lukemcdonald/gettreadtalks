import { mutations, queries } from './model/speakers';

// Queries
export const {
  getSpeaker,
  getSpeakerBySlug,
  listAllSpeakers,
  listFeaturedSpeakers,
  listSpeakerRoles,
  listSpeakerSlugs,
  listSpeakers,
} = queries;

// Mutations
export const { createSpeaker, destroySpeaker, updateSpeaker } = mutations;
