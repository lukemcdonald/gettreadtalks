import { mutations, queries } from './model/talks';

// Queries
export const getTalk = queries.getTalk;
export const getTalkBySlug = queries.getTalkBySlugWithRelations;
export const getTalksCount = queries.getTalksCount;
export const listFeaturedTalks = queries.listFeaturedTalks;
export const listRandomTalksBySpeaker = queries.getRandomTalksBySpeaker;
export const listTalks = queries.getTalks;
export const listTalksByCollection = queries.getTalksByCollection;
export const listTalksBySpeaker = queries.getTalksBySpeaker;
export const listTalksWithSpeakers = queries.getTalksWithSpeakers;

// Mutations
export const archiveTalk = mutations.archiveTalk;
export const createTalk = mutations.createTalk;
export const updateTalk = mutations.updateTalk;
export const updateTalkStatus = mutations.updateTalkStatus;
