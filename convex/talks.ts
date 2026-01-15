import { mutations, queries } from './model/talks';

// Queries
export const getTalk = queries.getTalk;
export const getTalkBySlug = queries.getTalkBySlug;
export const getTalksCount = queries.getTalksCount;
export const listAllTalks = queries.listAllTalks;
export const listFeaturedTalks = queries.listFeaturedTalks;
export const listFeaturedTalksWithSpeakers = queries.listFeaturedTalksWithSpeakers;
export const listRandomTalksBySpeaker = queries.listRandomTalksBySpeaker;
export const listTalks = queries.listTalks;
export const listTalksByCollection = queries.listTalksByCollection;
export const listTalksBySpeaker = queries.listTalksBySpeaker;

// Mutations
export const archiveTalk = mutations.archiveTalk;
export const createTalk = mutations.createTalk;
export const destroyTalk = mutations.destroyTalk;
export const updateTalk = mutations.updateTalk;
export const updateTalkStatus = mutations.updateTalkStatus;
