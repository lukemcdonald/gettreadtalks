import { mutations, queries } from './model/talks';

export {
  generateTalkSummary,
  loadTalkSummarySource,
} from './model/talks/summaryGenerate';
export { fetchTalkTranscript } from './model/talks/transcriptFetch';
export { saveTalkTranscriptFetchOutcome } from './model/talks/transcriptPersistence';

// Queries
export const {
  getTalk,
  getTalkBySlug,
  getTalkTranscript,
  getTalkTranscriptFetch,
  getTalkTranscriptText,
  getTalksCount,
  listAllTalks,
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
  migrateTalkSummaries,
  saveTalkSummaryDraft,
  updateTalk,
  updateTalkSummary,
  updateTalkTranscript,
  upsertTalkTranscript,
} = mutations;
