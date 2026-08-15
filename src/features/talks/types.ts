import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { Speaker } from '@/features/speakers/types';
import type { StatusType } from '@/lib/entities/types';

export type Talk = Doc<'talks'>;
export type TalkId = Id<'talks'>;

/** Talk fields used in selection/dropdown UIs */
export type TalkListItem = Pick<Talk, '_id' | 'title'>;

export type TalkStatus = StatusType;
export type TalkWithSpeaker = Talk & {
  speaker: Speaker | null;
};
export type TalkWithSpeakerAndTopics = TalkWithSpeaker & {
  topicSlugs: string[];
};

export type TalkFormInitialData = Pick<
  Talk,
  | 'collectionId'
  | 'collectionOrder'
  | 'description'
  | 'featured'
  | 'mediaUrl'
  | 'scripture'
  | 'slug'
  | 'speakerId'
  | 'status'
  | 'title'
>;
