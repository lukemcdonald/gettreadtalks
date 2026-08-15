import { mutations, queries } from './model/collections';

// Queries
export const {
  getCollection,
  getCollectionBySlug,
  getCollectionWithSpeakers,
  getCollectionWithTalks,
  listAllCollections,
  listCollectionSlugsForSitemap,
  listCollections,
  listCollectionsBySpeaker,
} = queries;

// Mutations
export const { createCollection, destroyCollection, updateCollection } =
  mutations;
