import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { Speaker } from '@/features/speakers/types';
import type { TopicId } from '@/features/topics/types';
import type { StatusType } from '@/lib/entities/types';

export type Talk = Doc<'talks'>;
export type TalkId = Id<'talks'>;
export type TalkStudy = Doc<'talkStudies'>;
export type TalkTranscript = Doc<'talkTranscripts'>;

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
