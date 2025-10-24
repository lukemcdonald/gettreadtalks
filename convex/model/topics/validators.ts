import { v } from 'convex/values';

export const topicStatus = v.union(
  v.literal('active'),
  v.literal('inactive'),
  v.literal('pending'),
);
