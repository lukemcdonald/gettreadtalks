import { v } from 'convex/values';

export const createTopicArgs = {
  title: v.string(),
};

export const getTopicArgs = {
  id: v.id('topics'),
};

export const getTopicBySlugArgs = {
  slug: v.string(),
};

export const getTopicWithContentArgs = {
  limit: v.optional(v.number()),
  slug: v.string(),
};

export const listTopicsArgs = {
  limit: v.optional(v.number()),
};

export const updateTopicArgs = {
  id: v.id('topics'),
  title: v.optional(v.string()),
};
