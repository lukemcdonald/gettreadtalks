import { mutations, queries } from './model/topics';

// Queries
export const {
  getTopic,
  getTopicBySlug,
  getTopicWithContent,
  listAllTopics,
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
