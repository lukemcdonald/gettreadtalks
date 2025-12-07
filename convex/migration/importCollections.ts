import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import type { IdMapping } from './idMap';

import { generateSlug } from './utils';

/**
 * Import collections (from Airtable Series) from Airtable records.
 * @param ctx - Database context
 * @param records - Array of Airtable series records
 * @param idMapping - ID mapping to populate
 * @returns Array of created collection IDs
 */
export async function importCollections(
  ctx: MutationCtx,
  records: Array<{
    id: string;
    fields: {
      title?: string;
      link?: string;
    };
  }>,
  idMapping: IdMapping,
): Promise<Id<'collections'>[]> {
  const collectionIds: Id<'collections'>[] = [];

  for (const record of records) {
    const { id: airtableId, fields } = record;

    // Skip if missing required fields
    if (!fields.title) {
      console.warn(`Skipping collection ${airtableId}: missing title`);
      continue;
    }

    const slug = await generateSlug(ctx, 'collections', fields.title);

    const collectionId = await ctx.db.insert('collections', {
      description: undefined,
      slug,
      title: fields.title,
      url: fields.link,
    });

    idMapping.collections.set(airtableId, collectionId);
    collectionIds.push(collectionId);
  }

  return collectionIds;
}
