import type { Preloaded } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';

// biome-ignore lint/style/useImportType: Convex API imports needed for typeof in type definitions
import { api } from '@/convex/_generated/api';

// Re-export commonly used Convex types for talks
export type PreloadedTalks = Preloaded<typeof api.talks.listTalks>;
export type TalkData = NonNullable<FunctionReturnType<typeof api.talks.getTalkBySlug>>;
