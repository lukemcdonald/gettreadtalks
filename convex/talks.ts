import { mutations, queries } from './model/talks';

export { fetchTalkTranscript } from './model/talks/transcriptFetch';

// Queries
export const {
  getTalk,
  getTalkBySlug,
  getTalkStudy,
  getTalkTranscript,
  getTalkTranscriptFetch,
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
  completeTalkTranscriptFetch,
  createTalk,
  createTalkTranscriptFetch,
  destroyTalk,
  saveTalkStudyDraft,
  updateTalk,
  updateTalkStudy,
  upsertTalkTranscript,
} = mutations;
