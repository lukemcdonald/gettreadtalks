import { v } from 'convex/values';

import { statusType } from '../../lib/validators';
import { speakerFields } from '../speakers/schema';
import { talkFields } from './schema';

export const createTalkArgs = {
  collectionId: v.optional(v.id('collections')),
  collectionOrder: v.optional(v.number()),
  mediaUrl: v.string(),
  scripture: v.optional(v.string()),
  speakerId: v.id('speakers'),
  status: v.optional(statusType),
  title: v.string(),
};
export const createTalkReturns = v.id('talks');

export const getTalkArgs = {
  id: v.id('talks'),
};
export const getTalkReturns = v.union(v.object(talkFields), v.null());

export const getTalkBySlugArgs = {
  slug: v.string(),
};
export const getTalkBySlugReturns = v.union(
  v.object({
    collection: v.union(v.any(), v.null()),
    speaker: v.union(v.any(), v.null()),
    talk: v.any(),
  }),
  v.null(),
);

export const getTalksByCollectionArgs = {
  collectionId: v.id('collections'),
  limit: v.optional(v.number()),
};
export const getTalksByCollectionReturns = v.array(v.object(talkFields));

export const getTalksBySpeakerArgs = {
  limit: v.optional(v.number()),
  speakerId: v.id('speakers'),
};
export const getTalksBySpeakerReturns = v.array(v.object(talkFields));

export const listTalksArgs = {
  limit: v.optional(v.number()),
  status: v.optional(statusType),
};
export const listTalksReturns = v.array(
  v.object({
    ...talkFields,
    speaker: v.union(v.object(speakerFields), v.null()),
  }),
);

export const updateTalkStatusArgs = {
  id: v.id('talks'),
  status: statusType,
};
export const updateTalkStatusReturns = v.id('talks');
