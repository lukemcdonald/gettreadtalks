import type { Doc, Id } from '@/convex/_generated/dataModel';

export type Topic = Doc<'topics'>;
export type TopicId = Id<'topics'>;

/** Topic fields used in selection/dropdown UIs */
export type TopicListItem = Pick<Topic, '_id' | 'slug' | 'title'>;
