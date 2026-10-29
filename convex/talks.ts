import { mutations, queries } from './model/talks';

export { generateTalkStudy } from './model/talks/studyGenerate';
export {
  generateTalkSummary,
  loadTalkSummarySource,
} from './model/talks/summaryGenerate';
export { fetchTalkTranscript } from './model/talks/transcriptFetch';

// Queries
export const {
  getTalk,
  getTalkBySlug,
  getTalkStudy,
  getTalkTranscript,
  getTalkTranscriptFetch,
  getTalkTranscriptText,
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
  backfillTalkPublishedAt,
  completeTalkTranscriptFetch,
  createTalk,
  createTalkTranscriptFetch,
  destroyTalk,
  saveTalkStudyDraft,
  updateTalk,
  updateTalkStudy,
  updateTalkTranscript,
  upsertTalkTranscript,
} = mutations;
