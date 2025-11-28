import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import type { IdMapping } from './idMap';

import { lookupId } from './utils';

/**
 * Import talksOnTopics join table from Airtable talk records.
 * @param ctx - Database context
 * @param records - Array of Airtable talk records with topics field
 * @param idMapping - ID mapping for FK resolution
 * @returns Array of created join record IDs
 */
export async function importTalksOnTopics(
  ctx: MutationCtx,
  records: Array<{
    id: string;
    fields: {
      topics?: string[];
    };
  }>,
  idMapping: IdMapping,
): Promise<Id<'talksOnTopics'>[]> {
  const joinIds: Id<'talksOnTopics'>[] = [];

  for (const record of records) {
    const { id: airtableTalkId, fields } = record;

    const talkId = lookupId(idMapping, 'talks', airtableTalkId);

    if (!talkId) {
      continue;
    }

    if (!fields.topics || fields.topics.length === 0) {
      continue;
    }

    for (const airtableTopicId of fields.topics) {
      const topicId = lookupId(idMapping, 'topics', airtableTopicId);

      if (!topicId) {
        console.warn(`Skipping talksOnTopics: topic ${airtableTopicId} not found`);
        continue;
      }

      // Check if association already exists
      const existing = await ctx.db
        .query('talksOnTopics')
        .withIndex('by_talkId_and_topicId', (q) => q.eq('talkId', talkId).eq('topicId', topicId))
        .unique();

      if (existing) {
        continue;
      }

      const joinId = await ctx.db.insert('talksOnTopics', {
        talkId,
        topicId,
      });

      joinIds.push(joinId);
    }
  }

  return joinIds;
}

/**
 * Import clipsOnTopics join table from Airtable clip records.
 * @param ctx - Database context
 * @param records - Array of Airtable clip records with topics field
 * @param idMapping - ID mapping for FK resolution
 * @returns Array of created join record IDs
 */
export async function importClipsOnTopics(
  ctx: MutationCtx,
  records: Array<{
    id: string;
    fields: {
      topics?: string[];
    };
  }>,
  idMapping: IdMapping,
): Promise<Id<'clipsOnTopics'>[]> {
  const joinIds: Id<'clipsOnTopics'>[] = [];

  for (const record of records) {
    const { id: airtableClipId, fields } = record;

    const clipId = lookupId(idMapping, 'clips', airtableClipId);

    if (!clipId) {
      continue;
    }

    if (!fields.topics || fields.topics.length === 0) {
      continue;
    }

    for (const airtableTopicId of fields.topics) {
      const topicId = lookupId(idMapping, 'topics', airtableTopicId);

      if (!topicId) {
        console.warn(`Skipping clipsOnTopics: topic ${airtableTopicId} not found`);
        continue;
      }

      // Check if association already exists
      const existing = await ctx.db
        .query('clipsOnTopics')
        .withIndex('by_clipId_and_topicId', (q) => q.eq('clipId', clipId).eq('topicId', topicId))
        .unique();

      if (existing) {
        continue;
      }

      const joinId = await ctx.db.insert('clipsOnTopics', {
        clipId,
        topicId,
      });

      joinIds.push(joinId);
    }
  }

  return joinIds;
}
