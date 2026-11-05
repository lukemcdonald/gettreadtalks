import { mutations, queries } from './model/topics';

// Queries
export const {
  getTopic,
  getTopicBySlug,
  listAllTopics,
  listTopicSlugs,
  listTopicsWithCount,
  listTopicsWithTalks,
} = queries;

// Mutations
export const { createTopic, destroyTopic, updateTopic } = mutations;
