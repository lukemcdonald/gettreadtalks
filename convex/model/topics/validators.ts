import { v } from 'convex/values';

import { clipFields } from '../clips/schema';
import { talkFields } from '../talks/schema';
import { topicFields } from './schema';

export const createTopicArgs = {
  title: v.string(),
};

export const createTopicReturns = v.id('topics');

export const getTopicArgs = {
  id: v.id('topics'),
};

export const getTopicReturns = v.union(v.object(topicFields), v.null());

export const getTopicBySlugArgs = {
  slug: v.string(),
};

export const getTopicBySlugReturns = v.union(v.object(topicFields), v.null());

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

export const updateTopicArgs = {
  id: v.id('topics'),
  title: v.optional(v.string()),
};

export const updateTopicReturns = v.id('topics');
