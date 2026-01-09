import { type Infer, v } from 'convex/values';

/**
 * Database status types.
 * Used for actual document status in the database.
 */
export const statusType = v.union(
  v.literal('approved'),
  v.literal('archived'),
  v.literal('backlog'),
  v.literal('published'),
);

export type StatusType = Infer<typeof statusType>;

/**
 * Status filter type for admin queries.
 * Extends statusType with 'all' option for showing all statuses.
 */
export const statusFilterType = v.union(statusType, v.literal('all'));

export type StatusFilterType = Infer<typeof statusFilterType>;

export const timestampFields = {
  // Note: Convex provides a `_creationTime` field automatically
  deletedAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
};
