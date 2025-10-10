import { v } from 'convex/values';

import { speakerFields } from './schema';

export const createSpeakerArgs = {
  description: v.optional(v.string()),
  firstName: v.string(),
  imageUrl: v.optional(v.string()),
  lastName: v.string(),
  ministry: v.optional(v.string()),
  role: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
};

export const createSpeakerReturns = v.id('speakers');

export const deleteSpeakerArgs = {
  id: v.id('speakers'),
};

export const deleteSpeakerReturns = v.null();

export const getFeaturedSpeakersArgs = {
  limit: v.optional(v.number()),
};

export const getFeaturedSpeakersReturns = v.array(v.object(speakerFields));

export const getSpeakerArgs = {
  id: v.id('speakers'),
};

export const getSpeakerReturns = v.union(v.object(speakerFields), v.null());

export const getSpeakerBySlugArgs = {
  slug: v.string(),
};

export const getSpeakerBySlugReturns = v.union(v.object(speakerFields), v.null());

export const listSpeakersArgs = {
  limit: v.optional(v.number()),
};

export const listSpeakersReturns = v.array(v.object(speakerFields));

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

export const updateSpeakerReturns = v.id('speakers');
