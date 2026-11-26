import type { Infer } from 'convex/values';

import { literals } from 'convex-helpers/validators';
import { v } from 'convex/values';

export const talkFormats = [
  'debate',
  'lecture',
  'panel-discussion',
  'qa',
  'sermon',
  'street-evangelism',
  'testimony',
] as const;

export type TalkFormat = (typeof talkFormats)[number];

export const talkFormat = literals(...talkFormats);

export function parseTalkFormat(value?: string | null) {
  if (!value) {
    return;
  }

  return talkFormats.find((format) => format === value);
}

export const statusType = v.union(
  v.literal('approved'),
  v.literal('archived'),
  v.literal('backlog'),
  v.literal('published')
);

export const talkStudyStatus = v.union(
  v.literal('draft'),
  v.literal('published')
);

const scriptureRef = v.object({
  book: v.string(),
  chapter: v.number(),
  verseStart: v.optional(v.number()),
  verseEnd: v.optional(v.number()),
});

const talkStudyGuideKind = v.union(
  v.literal('application'),
  v.literal('discussion_question'),
  v.literal('key_idea'),
  v.literal('prayer')
);

const talkStudyGuideSection = v.object({
  kind: talkStudyGuideKind,
  scriptureRefs: v.optional(v.array(scriptureRef)),
  text: v.string(),
});

const talkStudyOutlineItemValidator = v.object({
  heading: v.string(),
  text: v.string(),
});

export const talkStudyContentFields = {
  outline: v.array(talkStudyOutlineItemValidator),
  scriptureRefs: v.array(scriptureRef),
  studyGuide: v.array(talkStudyGuideSection),
  suggestedTopics: v.array(v.string()),
  summary: v.string(),
};

export const talkTranscriptQuality = v.union(
  v.literal('fair'),
  v.literal('good'),
  v.literal('poor')
);

export const talkTranscriptSource = v.union(
  v.literal('hosted_stt'),
  v.literal('manual'),
  v.literal('speaker_audio_stt'),
  v.literal('speaker_published'),
  v.literal('video_audio_stt'),
  v.literal('youtube_captions')
);

export const talkTranscriptStatus = v.union(
  v.literal('blocked'),
  v.literal('done'),
  v.literal('failed')
);

export const talkTranscriptFetchErrorCode = v.union(
  v.literal('JOB_NOT_FOUND'),
  v.literal('NO_TRANSCRIPT'),
  v.literal('NOT_FOUND'),
  v.literal('PROVIDER_AUTH_FAILED'),
  v.literal('PROVIDER_ERROR'),
  v.literal('QUOTA_EXCEEDED'),
  v.literal('QUOTA_EXHAUSTED'),
  v.literal('RATE_LIMITED'),
  v.literal('RESTRICTED'),
  v.literal('TIMED_OUT'),
  v.literal('UNSUPPORTED_URL')
);

export type TranscriptFetchErrorCode = Infer<
  typeof talkTranscriptFetchErrorCode
>;

export const TALK_DRAFT_PENDING = 'pending';

export const talkTranscriptFetchStatus = v.union(
  v.literal('failed'),
  v.literal('pending'),
  v.literal('success')
);

export const talkTranscriptFetchLastError = v.object({
  errorCode: talkTranscriptFetchErrorCode,
  message: v.string(),
  retryAfter: v.optional(v.number()),
});
