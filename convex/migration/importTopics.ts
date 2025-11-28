import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import type { IdMapping } from './idMap';

import { ensureUniqueSlug } from './utils';

/**
 * Import topics from Airtable records.
 * @param ctx - Database context
 * @param records - Array of Airtable topic records
 * @param idMapping - ID mapping to populate
 * @returns Array of created topic IDs
 */
export async function importTopics(
  ctx: MutationCtx,
  records: Array<{
    id: string;
    fields: {
      title?: string;
    };
  }>,
  idMapping: IdMapping,
): Promise<Id<'topics'>[]> {
  const topicIds: Id<'topics'>[] = [];

  for (const record of records) {
    const { id: airtableId, fields } = record;

    // Skip if missing required fields
    if (!fields.title) {
      console.warn(`Skipping topic ${airtableId}: missing title`);
      continue;
    }

    const slug = await ensureUniqueSlug(ctx, 'topics', fields.title);

    const topicId = await ctx.db.insert('topics', {
      slug,
      title: fields.title,
    });

    idMapping.topics.set(airtableId, topicId);
    topicIds.push(topicId);
  }

  return topicIds;
}
