import type { Doc, Id } from '@/convex/_generated/dataModel';

export type Speaker = Doc<'speakers'>;
export type SpeakerId = Id<'speakers'>;

/** Speaker fields used in selection/dropdown UIs */
export type SpeakerListItem = Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'imageUrl' | 'role'>;
