import { mutations, queries } from './model/collections';

// Queries
export const {
  getCollection,
  getCollectionBySlug,
  listAllCollections,
  listCollectionSlugs,
  listCollections,
} = queries;

// Mutations
export const { createCollection, destroyCollection, updateCollection } =
  mutations;
