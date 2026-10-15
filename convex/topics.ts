import { mutations, queries } from './model/topics';

// Queries
export const {
  getTopic,
  getTopicBySlug,
  listAllTopics,
  listTopicSlugs,
  listTopics,
  listTopicsWithCount,
  listTopicsWithTalks,
} = queries;

// Mutations
export const {
  addTalkToTopic,
  createTopic,
  destroyTopic,
  removeTalkFromTopic,
  updateTopic,
} = mutations;
