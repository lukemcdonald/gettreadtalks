import { v } from 'convex/values';

import { doc, docs } from '../../lib/validators/schema';

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

export const destroyTopicArgs = {
  id: v.id('topics'),
};

export const destroyTopicReturns = v.null();

export const getTopicArgs = {
  id: v.id('topics'),
};

export const getTopicReturns = doc('topics', true);

export const getTopicBySlugArgs = {
  slug: v.string(),
};

export const getTopicBySlugReturns = doc('topics', true);

export const listWithCountArgs = {
  limit: v.optional(v.number()),
};

export const listWithCountReturns = v.array(
  v.object({
    count: v.number(),
    topic: doc('topics'),
  }),
);

export const getTopicWithContentArgs = {
  limit: v.optional(v.number()),
  slug: v.string(),
};

export const getTopicWithContentReturns = v.union(
  v.object({
    clips: docs('clips'),
    talks: docs('talks'),
    topic: doc('topics'),
  }),
  v.null(),
);

export const listTopicsArgs = {
  limit: v.optional(v.number()),
};

export const listTopicsReturns = docs('topics');

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
