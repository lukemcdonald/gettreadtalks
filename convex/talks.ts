import { mutations, queries } from './model/talks';

// Queries
export const getTalk = queries.getTalk;
export const getTalkBySlug = queries.getTalkBySlugWithRelations;
export const getTalksCount = queries.getTalksCount;
export const listFeaturedTalks = queries.listFeaturedTalks;
export const listRandomTalksBySpeaker = queries.listRandomTalksBySpeaker;
export const listTalks = queries.listTalks;
export const listTalksByCollection = queries.listTalksByCollection;
export const listTalksBySpeaker = queries.listTalksBySpeaker;
export const listTalksWithSpeakers = queries.listTalksWithSpeakers;

// Mutations
export const archiveTalk = mutations.archiveTalk;
export const createTalk = mutations.createTalk;
export const updateTalk = mutations.updateTalk;
export const updateTalkStatus = mutations.updateTalkStatus;
