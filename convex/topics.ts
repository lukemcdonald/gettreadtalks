import { mutations, queries } from './model/topics';

export const addClipToTopic = mutations.addClipToTopic;
export const addTalkToTopic = mutations.addTalkToTopic;
export const create = mutations.createTopic;
export const destroy = mutations.destroyTopic;
export const get = queries.getTopic;
export const getBySlug = queries.getTopicBySlug;
export const getWithContent = queries.getTopicWithContent;
export const list = queries.getTopics;
export const listWithCount = queries.getTopicsWithCount;
export const removeClipFromTopic = mutations.removeClipFromTopic;
export const removeTalkFromTopic = mutations.removeTalkFromTopic;
export const update = mutations.updateTopic;
