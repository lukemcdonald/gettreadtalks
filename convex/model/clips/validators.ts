import { v } from 'convex/values';

import { statusType } from '../../lib/validators';
import { clipFields } from './schema';

export const createClipArgs = {
  description: v.optional(v.string()),
  mediaUrl: v.string(),
  speakerId: v.optional(v.id('speakers')),
  status: v.optional(statusType),
  talkId: v.optional(v.id('talks')),
  title: v.string(),
};

export const createClipReturns = v.id('clips');

export const getClipBySlugWithRelationsArgs = {
  slug: v.string(),
};

export const getClipBySlugWithRelationsReturns = v.union(
  v.object({
    clip: v.any(),
    speaker: v.union(v.any(), v.null()),
    talk: v.union(v.any(), v.null()),
    topics: v.array(v.any()),
  }),
  v.null(),
);

export const getPublishedClipsArgs = {
  limit: v.number(),
};

export const getPublishedClipsReturns = v.array(v.object(clipFields));

export const updateClipStatusArgs = {
  id: v.id('clips'),
  status: v.union(
    v.literal('approved'),
    v.literal('archived'),
    v.literal('backlog'),
    v.literal('published'),
  ),
};

export const updateClipStatusReturns = v.id('clips');
