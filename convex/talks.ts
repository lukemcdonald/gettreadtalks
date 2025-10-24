import { mutations, queries } from './model/talks';

export const archive = mutations.archiveTalk;
export const create = mutations.createTalk;
export const get = queries.getTalk;
export const getBySlug = queries.getTalkBySlugWithRelations;
export const getBySpeaker = queries.getTalksBySpeaker;
export const getByCollection = queries.getTalksByCollection;
export const getCount = queries.getTalksCount;
export const getRandomBySpeaker = queries.getRandomTalksBySpeaker;
export const list = queries.getTalks;
export const listByCollection = queries.getTalksByCollection;
export const listBySpeaker = queries.getTalksBySpeaker;
export const listFeatured = queries.listFeaturedTalks;
export const listRandomBySpeaker = queries.getRandomTalksBySpeaker;
export const listWithSpeakers = queries.getTalksWithSpeakers;
export const update = mutations.updateTalk;
export const updateStatus = mutations.updateTalkStatus;