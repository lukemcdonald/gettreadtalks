import { mutations, queries } from './model/speakers';

// Queries
export const {
  getSpeaker,
  getSpeakerBySlug,
  getSpeakersCount,
  listAllSpeakers,
  listAllSpeakersAdmin,
  listAllSpeakersRaw,
  listFeaturedSpeakers,
  listSpeakerSlugsForSitemap,
  listSpeakers,
} = queries;

// Mutations
export const { createSpeaker, destroySpeaker, updateSpeaker } = mutations;
