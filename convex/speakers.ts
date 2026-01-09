import { mutations, queries } from './model/speakers';

// Queries
export const getSpeaker = queries.getSpeaker;
export const getSpeakerBySlug = queries.getSpeakerBySlug;
export const getSpeakersCount = queries.getSpeakersCount;
export const listFeaturedSpeakers = queries.listFeaturedSpeakers;
export const listSpeakers = queries.listSpeakers; // Public: filtered to speakers with published talks
export const listSpeakersAdmin = queries.listSpeakersAdmin; // Admin: all speakers

// Mutations
export const createSpeaker = mutations.createSpeaker;
export const destroySpeaker = mutations.destroySpeaker;
export const updateSpeaker = mutations.updateSpeaker;
