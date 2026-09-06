import { mutations, queries } from './model/talks';

// Queries
export const {
  getTalk,
  getTalkBySlug,
  getTalksCount,
  listAllTalks,
  listFeaturedTalks,
  listFeaturedTalksWithSpeakers,
  listRandomTalksBySpeaker,
  listTalkSlugsForSitemap,
  listTalkTopics,
  listTalks,
  listTalksByCollection,
  listTalksBySpeaker,
} = queries;

// Mutations
export const { archiveTalk, createTalk, destroyTalk, updateTalk } = mutations;
