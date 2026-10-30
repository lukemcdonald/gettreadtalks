import { mutations, queries } from './model/talks';

export {
  generateTalkSummary,
  loadTalkSummarySource,
} from './model/talks/summary/generate';
export { fetchTalkTranscript } from './model/talks/transcript/fetch';
export { insertPendingTalkTranscriptFetch } from './model/talks/transcript/mutations';

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
