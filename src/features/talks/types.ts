import type { Preloaded } from 'convex/react';
import type { FunctionReturnType, PaginationResult } from 'convex/server';
import type { Doc, Id } from '@/convex/_generated/dataModel';

// biome-ignore lint/style/useImportType: Convex API imports needed for typeof in type definitions
import { api } from '@/convex/_generated/api';

export type Talk = Doc<'talks'>;
export type TalkId = Id<'talks'>;

// Re-export commonly used Convex types for talks
export type PreloadedTalks = Preloaded<typeof api.talks.listTalks>;
export type TalkData = NonNullable<FunctionReturnType<typeof api.talks.getTalkBySlug>>;

// Pagination result types
export type TalksPaginationResult = PaginationResult<Talk>;

// Talk with enriched relations
export type TalkWithSpeaker = Talk & {
  speaker: Doc<'speakers'> | null;
};

// Server function result types
export type TalksResult = Omit<PaginationResult<Talk>, 'page'> & {
  talks: TalkWithSpeaker[];
};
