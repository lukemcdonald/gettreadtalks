import { v } from 'convex/values';

export const affiliateLinkTypes = v.union(
  v.literal('app'),
  v.literal('book'),
  v.literal('movie'),
  v.literal('music'),
  v.literal('podcast'),
);
