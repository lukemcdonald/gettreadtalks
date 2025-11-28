import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import type { IdMapping } from './idMap';

import { ensureUniqueSlug, lookupId, mapStatus, parseTimestamp } from './utils';

/**
 * Import clips from Airtable records.
 * @param ctx - Database context
 * @param records - Array of Airtable clip records
 * @param idMapping - ID mapping for FK resolution
 * @returns Array of created clip IDs
 */
export async function importClips(
  ctx: MutationCtx,
  records: Array<{
    id: string;
    fields: {
      title?: string;
      speakers?: string[];
      talks?: string[];
      link?: string;
      published?: boolean;
      publishedDate?: string;
    };
  }>,
  idMapping: IdMapping,
): Promise<Id<'clips'>[]> {
  const clipIds: Id<'clips'>[] = [];

  for (const record of records) {
    const { id: airtableId, fields } = record;

    // Skip if missing required fields
    if (!fields.title) {
      console.warn(`Skipping clip ${airtableId}: missing title`);
      continue;
    }

    // Resolve optional FKs
    const speakerId = lookupId(idMapping, 'speakers', fields.speakers?.[0]);
    const talkId = lookupId(idMapping, 'talks', fields.talks?.[0]);

    const slug = await ensureUniqueSlug(ctx, 'clips', fields.title);
    const status = mapStatus(undefined, fields.published);
    const publishedAt = status === 'published' ? parseTimestamp(fields.publishedDate) : undefined;

    const clipId = await ctx.db.insert('clips', {
      description: undefined,
      mediaUrl: fields.link ?? '',
      publishedAt,
      slug,
      speakerId,
      status,
      talkId,
      title: fields.title,
    });

    idMapping.clips.set(airtableId, clipId);
    clipIds.push(clipId);
  }

  return clipIds;
}
