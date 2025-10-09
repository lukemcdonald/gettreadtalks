import { v } from 'convex/values';

export const createTopicArgs = {
  title: v.string(),
};

export const updateTopicArgs = {
  id: v.id('topics'),
  title: v.optional(v.string()),
};
