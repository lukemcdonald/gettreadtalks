import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import type { IdMapping } from './idMap';

import { ensureUniqueSlug } from './utils';

/**
 * Import speakers from Airtable records.
 * @param ctx - Database context
 * @param records - Array of Airtable speaker records
 * @param idMapping - ID mapping to populate
 * @returns Array of created speaker IDs
 */
export async function importSpeakers(
  ctx: MutationCtx,
  records: Array<{
    id: string;
    fields: {
      firstName?: string;
      lastName?: string;
      role?: string;
      ministry?: string;
      website?: string;
      description?: string;
      avatar?: Array<{ url?: string }>;
      favorite?: boolean;
    };
  }>,
  idMapping: IdMapping,
): Promise<Id<'speakers'>[]> {
  const speakerIds: Id<'speakers'>[] = [];

  for (const record of records) {
    const { id: airtableId, fields } = record;

    // Skip if missing required fields
    if (!(fields.firstName && fields.lastName)) {
      console.warn(`Skipping speaker ${airtableId}: missing firstName or lastName`);
      continue;
    }

    const slug = await ensureUniqueSlug(ctx, 'speakers', `${fields.firstName} ${fields.lastName}`);

    const speakerId = await ctx.db.insert('speakers', {
      description: fields.description,
      featured: fields.favorite ?? false,
      firstName: fields.firstName,
      imageUrl: `/images/speakers/${slug}.jpg`,
      lastName: fields.lastName,
      ministry: fields.ministry,
      role: fields.role,
      slug,
      websiteUrl: fields.website,
    });

    idMapping.speakers.set(airtableId, speakerId);
    speakerIds.push(speakerId);
  }

  return speakerIds;
}
