import { mutations, queries } from './model/collections';

// Queries
export const {
  getCollection,
  getCollectionBySlug,
  listAllCollections,
  listCollections,
  listCollectionsBySpeaker,
  listPublishedCollections,
} = queries;

// Mutations
export const { createCollection, destroyCollection, updateCollection } =
  mutations;
