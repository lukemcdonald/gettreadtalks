import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { Speaker } from '@/features/speakers/types';
import type { TopicId } from '@/features/topics/types';
import type { StatusType } from '@/lib/entities/types';

export type Talk = Doc<'talks'>;
export type TalkId = Id<'talks'>;
export type TalkStudy = Doc<'talkStudies'>;
export type TalkTranscript = Doc<'talkTranscripts'>;
export type TalkTranscriptFetch = Doc<'talkTranscriptFetches'>;
export type TalkTranscriptMeta = Omit<TalkTranscript, 'text'>;
export type TalkWithoutTranscript = Talk & {
  lastError: {
    errorCode: TalkTranscriptFetch['errorCode'];
    message: string;
    retryAfter?: number;
  } | null;
};

/** Talk fields used in selection/dropdown UIs */
export type TalkListItem = Pick<Talk, '_id' | 'title'>;

export type TalkStatus = StatusType;
export type TalkWithSpeaker = Talk & {
  speaker: Speaker | null;
};
export type TalkWithSpeakerAndTopics = TalkWithSpeaker & {
  collectionTitle?: string | null;
  featuredClipTitle?: string | null;
  topicSlugs: string[];
};
export type TalkWithTopicIds = Talk & {
  topicIds: TopicId[];
};
