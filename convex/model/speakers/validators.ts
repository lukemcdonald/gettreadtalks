import { v } from 'convex/values';

export const createSpeakerArgs = {
  description: v.optional(v.string()),
  firstName: v.string(),
  imageUrl: v.optional(v.string()),
  lastName: v.string(),
  ministry: v.optional(v.string()),
  role: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
};

export const getSpeakerArgs = {
  id: v.id('speakers'),
};

export const getSpeakerBySlugArgs = {
  slug: v.string(),
};

export const listSpeakersArgs = {
  limit: v.optional(v.number()),
};

export const updateSpeakerArgs = {
  description: v.optional(v.string()),
  firstName: v.optional(v.string()),
  id: v.id('speakers'),
  imageUrl: v.optional(v.string()),
  lastName: v.optional(v.string()),
  ministry: v.optional(v.string()),
  role: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
};
