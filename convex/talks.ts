import { mutations, queries } from './model/talks';

// Queries
export const {
  getTalk,
  getTalkBySlug,
  getTalkStudy,
  getTalkTranscript,
  getTalksCount,
  listAllTalks,
  listDraftTalkStudies,
  listFeaturedTalksWithSpeakers,
  listRandomTalksBySpeaker,
  listTalkSlugs,
  listTalkTopics,
  listTalkTranscripts,
  listTalks,
  listTalksByCollection,
  listTalksBySpeaker,
  listTalksByTopics,
  listTalksWithoutTranscript,
} = queries;

// Mutations
export const {
  archiveTalk,
  createTalk,
  destroyTalk,
  publishTalkStudy,
  saveTalkStudyDraft,
  unpublishTalkStudy,
  updateTalk,
  updateTalkStudy,
  upsertTalkTranscript,
} = mutations;
