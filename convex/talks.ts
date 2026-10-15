import { mutations, queries } from './model/talks';

// Queries
export const {
  getTalk,
  getTalkBySlug,
  getTalksCount,
  listAllPublishedTalks,
  listAllTalks,
  listFeaturedTalksWithSpeakers,
  listRandomTalksBySpeaker,
  listTalkTopics,
  listTalks,
  listTalksByCollection,
  listTalksBySpeaker,
} = queries;

// Mutations
export const { archiveTalk, createTalk, destroyTalk, updateTalk } = mutations;
