import type { Preloaded } from 'convex/react';
import type { FunctionReturnType, PaginationResult } from 'convex/server';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { Speaker } from '@/features/speakers/types';
import type { StatusType } from '@/lib/entities/types';

// biome-ignore lint/style/useImportType: Convex imports for typeof definitions
import { api } from '@/convex/_generated/api';

export type Talk = Doc<'talks'>;
export type TalkId = Id<'talks'>;

/** Talk fields used in selection/dropdown UIs */
export type TalkListItem = Pick<Talk, '_id' | 'title'>;

export type PreloadedTalks = Preloaded<typeof api.talks.listTalks>;
export type TalkData = NonNullable<FunctionReturnType<typeof api.talks.getTalkBySlug>>;
export type TalkStatus = StatusType;
export type TalkWithSpeaker = Talk & {
  speaker: Speaker | null;
};
export type TalkWithSpeakerAndTopics = TalkWithSpeaker & {
  topicSlugs: string[];
};

export type TalksPaginationResult = PaginationResult<Talk>;

export type TalksResult = Omit<PaginationResult<Talk>, 'page'> & {
  talks: TalkWithSpeaker[];
};
