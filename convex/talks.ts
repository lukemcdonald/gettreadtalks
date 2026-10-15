import { mutations, queries } from './model/talks';

// Queries
export const {
  getTalk,
  getTalkBySlug,
  getTalksCount,
  listAllTalks,
  listFeaturedTalksWithSpeakers,
  listPublishedTalks,
  listRandomTalksBySpeaker,
  listTalkTopics,
  listTalks,
  listTalksByCollection,
  listTalksBySpeaker,
} = queries;

// Mutations
export const { archiveTalk, createTalk, destroyTalk, updateTalk } = mutations;
