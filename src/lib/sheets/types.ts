import type { ClipId } from '@/features/clips/types';
import type { CollectionId } from '@/features/collections/types';
import type { SpeakerId } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks/types';
import type { TopicId } from '@/features/topics/types';

export type SheetEntity = 'talk' | 'speaker' | 'clip' | 'collection' | 'topic';
export type SheetAction = 'new' | 'edit';

export type SheetEntityId = TalkId | SpeakerId | ClipId | CollectionId | TopicId;

export interface ParsedSheetParam {
  entity: SheetEntity;
  action: SheetAction;
  id?: string;
}

export interface EntityIdMap {
  talk: TalkId;
  speaker: SpeakerId;
  clip: ClipId;
  collection: CollectionId;
  topic: TopicId;
}
