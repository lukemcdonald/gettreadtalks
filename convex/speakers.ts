import { mutations, queries } from './model/speakers';

// Queries
export const getSpeaker = queries.getSpeaker;
export const getSpeakerBySlug = queries.getSpeakerBySlug;
export const getSpeakersCount = queries.getSpeakersCount;
export const listFeaturedSpeakers = queries.listFeaturedSpeakers;
export const listSpeakers = queries.listSpeakers;
export const listSpeakersWithPublishedTalks = queries.listSpeakersWithPublishedTalks;

// Mutations
export const createSpeaker = mutations.createSpeaker;
export const destroySpeaker = mutations.destroySpeaker;
export const updateSpeaker = mutations.updateSpeaker;
