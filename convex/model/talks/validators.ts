import { v } from 'convex/values';

export const statusType = v.union(
  v.literal('approved'),
  v.literal('archived'),
  v.literal('backlog'),
  v.literal('published'),
);
