import { v } from 'convex/values';

import { clipFields } from '../clips/schema';
import { talkFields } from '../talks/schema';
import { topicFields } from './schema';

export const addClipToTopicArgs = {
  clipId: v.id('clips'),
  topicId: v.id('topics'),
};

export const addClipToTopicReturns = v.id('clipsOnTopics');

export const addTalkToTopicArgs = {
  talkId: v.id('talks'),
  topicId: v.id('topics'),
};

export const addTalkToTopicReturns = v.id('talksOnTopics');

export const createTopicArgs = {
  title: v.string(),
};

export const createTopicReturns = v.id('topics');

export const removeTopicArgs = {
  id: v.id('topics'),
};

export const removeTopicReturns = v.null();

export const getTopicArgs = {
  id: v.id('topics'),
};

export const getTopicReturns = v.union(v.object(topicFields), v.null());

export const getTopicBySlugArgs = {
  slug: v.string(),
};

export const getTopicBySlugReturns = v.union(v.object(topicFields), v.null());

export const getTopicsWithCountArgs = {
  limit: v.optional(v.number()),
};

export const getTopicsWithCountReturns = v.array(
  v.object({
    count: v.number(),
    topic: v.object(topicFields),
  }),
);

export const getTopicWithContentArgs = {
  limit: v.optional(v.number()),
  slug: v.string(),
};

export const getTopicWithContentReturns = v.union(
  v.object({
    clips: v.array(v.object(clipFields)),
    talks: v.array(v.object(talkFields)),
    topic: v.object(topicFields),
  }),
  v.null(),
);

export const listTopicsArgs = {
  limit: v.optional(v.number()),
};

export const listTopicsReturns = v.array(v.object(topicFields));

export const removeClipFromTopicArgs = {
  clipId: v.id('clips'),
  topicId: v.id('topics'),
};

export const removeClipFromTopicReturns = v.null();

export const removeTalkFromTopicArgs = {
  talkId: v.id('talks'),
  topicId: v.id('topics'),
};

export const removeTalkFromTopicReturns = v.null();

export const updateTopicArgs = {
  id: v.id('topics'),
  title: v.optional(v.string()),
};

export const updateTopicReturns = v.id('topics');
