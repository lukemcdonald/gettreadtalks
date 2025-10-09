import { v } from 'convex/values';

import { statusType } from '../../lib/validators';

export const createClipArgs = {
  description: v.optional(v.string()),
  mediaUrl: v.string(),
  speakerId: v.optional(v.id('speakers')),
  status: v.optional(statusType),
  talkId: v.optional(v.id('talks')),
  title: v.string(),
};

export const updateClipStatusArgs = {
  id: v.id('clips'),
  status: v.union(
    v.literal('approved'),
    v.literal('archived'),
    v.literal('backlog'),
    v.literal('published'),
  ),
};
