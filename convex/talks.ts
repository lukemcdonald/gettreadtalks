import { mutations, queries } from './model/talks';

export {
  fetchTalkTranscript,
  insertPendingTalkTranscriptFetch,
} from './model/talks/transcriptFetch';
export {
  generateTalkSummary,
  loadTalkSummarySource,
} from './model/talks/summaryGenerate';

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
