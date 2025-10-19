import { type Infer, v } from 'convex/values';

// Common status type for content items
export const statusType = v.union(
  v.literal('backlog'),
  v.literal('approved'),
  v.literal('published'),
  v.literal('archived'),
);

export type StatusType = Infer<typeof statusType>;

export const timestampFields = {
  // Note: Convex provides a `_creationTime` field automatically
  deletedAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
};
