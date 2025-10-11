import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { statusType } from '../../lib/validators';
import { speakerFields } from '../speakers/schema';
import { talkFields } from '../talks/schema';
import { topicFields } from '../topics/schema';
import { clipFields } from './schema';

export const createClipArgs = {
  description: v.optional(v.string()),
  mediaUrl: v.string(),
  speakerId: v.optional(v.id('speakers')),
  status: v.optional(statusType),
  talkId: v.optional(v.id('talks')),
  title: v.string(),
};

export const createClipReturns = v.id('clips');

export const archiveClipArgs = {
  id: v.id('clips'),
};

export const archiveClipReturns = v.null();

export const getClipBySlugWithRelationsArgs = {
  slug: v.string(),
};

export const getClipBySlugWithRelationsReturns = v.union(
  v.object({
    clip: v.object(clipFields),
    speaker: v.union(v.object(speakerFields), v.null()),
    talk: v.union(v.object(talkFields), v.null()),
    topics: v.array(v.object(topicFields)),
  }),
  v.null(),
);

export const getClipsBySpeakerArgs = {
  limit: v.optional(v.number()),
  speakerId: v.id('speakers'),
};

export const getClipsBySpeakerReturns = v.array(v.object(clipFields));

export const listClipsArgs = {
  paginationOpts: paginationOptsValidator,
  status: v.optional(statusType),
};

/**
 * Pagination return type uses v.any() per Convex standard pattern.
 * See: https://docs.convex.dev/database/pagination
 *
 * Returns: PaginationResult<Doc<'clips'>>
 * Structure: { page: Doc<'clips'>[], continueCursor: string, isDone: boolean }
 */
export const listClipsReturns = v.any();

export const updateClipArgs = {
  description: v.optional(v.string()),
  id: v.id('clips'),
  mediaUrl: v.optional(v.string()),
  speakerId: v.optional(v.id('speakers')),
  status: v.optional(statusType),
  talkId: v.optional(v.id('talks')),
  title: v.optional(v.string()),
};

export const updateClipReturns = v.id('clips');

export const updateClipStatusArgs = {
  id: v.id('clips'),
  status: v.union(
    v.literal('approved'),
    v.literal('archived'),
    v.literal('backlog'),
    v.literal('published'),
  ),
};

export const updateClipStatusReturns = v.id('clips');
