import { mutations, queries } from './model/speakers';

export const create = mutations.createSpeaker;
export const destroy = mutations.destroySpeaker;
export const get = queries.getSpeaker;
export const getBySlug = queries.getSpeakerBySlug;
export const getCount = queries.getSpeakersCount;
export const list = queries.getSpeakers;
export const listFeatured = queries.listFeaturedSpeakers;
export const update = mutations.updateSpeaker;