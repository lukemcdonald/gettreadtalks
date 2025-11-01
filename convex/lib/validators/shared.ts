import { v } from 'convex/values';

// Common status type for content items
export const statusType = v.union(
  v.literal('archived'),
  v.literal('approved'),
  v.literal('backlog'),
  v.literal('published'),
);

export const timestampFields = {
  // Note: Convex provides a `_creationTime` field automatically
  deletedAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
};
