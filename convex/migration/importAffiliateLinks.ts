import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

import { generateSlug } from './utils';

/**
 * Import affiliate links from Airtable records.
 * @param ctx - Database context
 * @param records - Array of Airtable affiliate link records
 * @returns Array of created affiliate link IDs
 */
export async function importAffiliateLinks(
  ctx: MutationCtx,
  records: Array<{
    id: string;
    fields: {
      title?: string;
      link?: string;
      description?: string;
      affiliate?: string;
      type?: string;
      featured?: boolean;
    };
  }>,
): Promise<Id<'affiliateLinks'>[]> {
  const affiliateLinkIds: Id<'affiliateLinks'>[] = [];

  for (const record of records) {
    const { id: airtableId, fields } = record;

    // Skip if missing required fields
    if (!(fields.title && fields.link)) {
      console.warn(`Skipping affiliate link ${airtableId}: missing title or link`);
      continue;
    }

    // Normalize type to lowercase
    const type = fields.type?.toLowerCase();

    // Validate type
    if (type && !['app', 'book', 'movie', 'music', 'podcast'].includes(type)) {
      console.warn(`Skipping affiliate link ${airtableId}: invalid type ${type}`);
      continue;
    }

    const slug = await generateSlug(ctx, 'affiliateLinks', fields.title);

    const affiliateLinkId = await ctx.db.insert('affiliateLinks', {
      affiliate: fields.affiliate,
      description: fields.description,
      featured: fields.featured ?? false,
      imageUrl: `/images/affiliate-links/${slug}.jpg`,
      slug,
      title: fields.title,
      type: (type as 'app' | 'book' | 'movie' | 'music' | 'podcast') || 'book',
      url: fields.link,
    });

    affiliateLinkIds.push(affiliateLinkId);
  }

  return affiliateLinkIds;
}
