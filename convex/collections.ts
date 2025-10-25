import { mutations, queries } from './model/collections';

// Queries
export const getCollection = queries.getCollection;
export const getCollectionBySlug = queries.getCollectionBySlug;
export const getCollectionWithSpeakers = queries.getCollectionWithSpeakers;
export const getCollectionWithTalks = queries.getCollectionWithTalks;
export const listCollections = queries.listCollections;
export const listCollectionsBySpeaker = queries.listCollectionsBySpeaker;
export const listCollectionsWithStats = queries.listCollectionsWithStats;

// Mutations
export const createCollection = mutations.createCollection;
export const destroyCollection = mutations.destroyCollection;
export const updateCollection = mutations.updateCollection;
