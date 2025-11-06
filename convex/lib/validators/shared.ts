import { type Infer, v } from 'convex/values';

export const statusType = v.union(
  v.literal('approved'),
  v.literal('archived'),
  v.literal('backlog'),
  v.literal('published'),
);

export type StatusType = Infer<typeof statusType>;

export const timestampFields = {
  // Note: Convex provides a `_creationTime` field automatically
  deletedAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
};
