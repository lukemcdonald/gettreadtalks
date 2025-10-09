import { v } from 'convex/values';

import { statusType } from '../../lib/validators';

// ============================================
// QUERY VALIDATORS
// ============================================

export const getTalkArgs = {
  id: v.id('talks'),
};

export const getTalkBySlugArgs = {
  slug: v.string(),
};

export const getTalksByCollectionArgs = {
  collectionId: v.id('collections'),
  limit: v.optional(v.number()),
};

export const getTalksBySpeakerArgs = {
  limit: v.optional(v.number()),
  speakerId: v.id('speakers'),
};

export const listTalksArgs = {
  limit: v.optional(v.number()),
  status: v.optional(statusType),
};

// ============================================
// MUTATION VALIDATORS
// ============================================

export const createTalkArgs = {
  collectionId: v.optional(v.id('collections')),
  collectionOrder: v.optional(v.number()),
  mediaUrl: v.string(),
  scripture: v.optional(v.string()),
  speakerId: v.id('speakers'),
  status: v.optional(statusType),
  title: v.string(),
};

export const updateTalkStatusArgs = {
  id: v.id('talks'),
  status: statusType,
};
