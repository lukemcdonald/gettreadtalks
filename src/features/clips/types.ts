import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { StatusType } from '@/convex/lib/validators/shared';

export type Clip = Doc<'clips'>;
export type ClipId = Id<'clips'>;
export type ClipsStatus = StatusType;
