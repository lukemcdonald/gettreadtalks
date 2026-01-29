import type { FunctionReturnType } from 'convex/server';
import type { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';

export type Clip = Doc<'clips'>;
export type ClipId = Id<'clips'>;

type ClipsListResult = FunctionReturnType<typeof api.clips.listClips>;
type ClipsListItem = ClipsListResult['page'][number];
export type ClipWithSpeaker = Omit<ClipsListItem, 'speaker'> & {
  speaker?: ClipsListItem['speaker'];
};
