import { mutations, queries } from './model/collections';

export const create = mutations.createCollection;
export const destroy = mutations.destroyCollection;
export const get = queries.getCollection;
export const getBySlug = queries.getCollectionBySlug;
export const getWithSpeakers = queries.getCollectionWithSpeakers;
export const getWithTalks = queries.getCollectionWithTalks;
export const list = queries.getCollections;
export const listBySpeaker = queries.getCollectionsBySpeaker;
export const listWithStats = queries.getCollectionsWithStats;
export const update = mutations.updateCollection;