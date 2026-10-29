import { v } from 'convex/values';

export const talkFeatureKind = v.union(v.literal('study'));

export const talkFeatureStatus = v.union(
  v.literal('draft'),
  v.literal('published')
);
