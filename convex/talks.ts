import { mutations, queries } from './model/talks';

// Queries
export const {
  getTalk,
  getTalkBySlug,
  getTalksCount,
  listAllTalks,
  listFeaturedTalksWithSpeakers,
  listRandomTalksBySpeaker,
  listTalkSlugs,
  listTalkTopics,
  listTalks,
  listTalksByCollection,
  listTalksBySpeaker,
  listTalksByTopics,
} = queries;

// Mutations
export const { archiveTalk, createTalk, destroyTalk, updateTalk } = mutations;
