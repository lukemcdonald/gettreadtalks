import { mutations, queries } from './model/topics';

// Queries
export const getTopic = queries.getTopic;
export const getTopicBySlug = queries.getTopicBySlug;
export const getTopicWithContent = queries.getTopicWithContent;
export const listTopics = queries.listTopics;
export const listTopicsWithCount = queries.listTopicsWithCount;
export const listTopicsWithTalks = queries.listTopicsWithTalks;

// Mutations
export const addTalkToTopic = mutations.addTalkToTopic;
export const createTopic = mutations.createTopic;
export const destroyTopic = mutations.destroyTopic;
export const removeTalkFromTopic = mutations.removeTalkFromTopic;
export const updateTopic = mutations.updateTopic;
