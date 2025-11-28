import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import type { IdMapping } from './idMap';

import { ensureUniqueSlug, lookupId, mapStatus, parseTimestamp } from './utils';

/**
 * Import talks from Airtable records.
 * @param ctx - Database context
 * @param records - Array of Airtable talk records
 * @param idMapping - ID mapping for FK resolution
 * @returns Array of created talk IDs
 */
export async function importTalks(
  ctx: MutationCtx,
  records: Array<{
    id: string;
    fields: {
      title?: string;
      speakers?: string[];
      link?: string;
      scripture?: string;
      notes?: string;
      series?: string[];
      seriesOrder?: number;
      status?: string;
      published?: boolean;
      publishedDate?: string;
      favorite?: boolean;
    };
  }>,
  idMapping: IdMapping,
): Promise<Id<'talks'>[]> {
  const talkIds: Id<'talks'>[] = [];

  for (const record of records) {
    const { id: airtableId, fields } = record;

    // Skip if missing required fields
    if (!fields.title) {
      console.warn(`Skipping talk ${airtableId}: missing title`);
      continue;
    }

    // Resolve speaker FK
    const speakerId = lookupId(idMapping, 'speakers', fields.speakers?.[0]);

    if (!speakerId) {
      console.warn(`Skipping talk ${airtableId}: speaker not found`);
      continue;
    }

    // Resolve collection FK (optional)
    const collectionId = lookupId(idMapping, 'collections', fields.series?.[0]);

    const slug = await ensureUniqueSlug(ctx, 'talks', fields.title);
    const status = mapStatus(fields.status, fields.published);
    const publishedAt = status === 'published' ? parseTimestamp(fields.publishedDate) : undefined;

    const talkId = await ctx.db.insert('talks', {
      collectionId,
      collectionOrder: fields.seriesOrder,
      description: fields.notes,
      featured: fields.favorite ?? false,
      mediaUrl: fields.link ?? '',
      publishedAt,
      scripture: fields.scripture,
      slug,
      speakerId,
      status,
      title: fields.title,
    });

    idMapping.talks.set(airtableId, talkId);
    talkIds.push(talkId);
  }

  return talkIds;
}
