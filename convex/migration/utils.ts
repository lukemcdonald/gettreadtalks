import type { MutationCtx } from '../_generated/server';
import type { StatusType } from '../lib/types';
import type { IdMapping } from './idMap';

import { slugExists, slugify } from '../lib/utils';

/**
 * Generate a unique slug for a table, appending numeric suffix if needed.
 * @param ctx - Database context
 * @param table - Table name with 'by_slug' index
 * @param baseText - Text to generate slug from
 * @returns Unique slug string
 */
export async function ensureUniqueSlug(
  ctx: MutationCtx,
  table: 'affiliateLinks' | 'clips' | 'collections' | 'speakers' | 'talks' | 'topics',
  baseText: string,
): Promise<string> {
  const baseSlug = slugify(baseText);

  if (!(await slugExists(ctx, table, baseSlug))) {
    return baseSlug;
  }

  // Try with numeric suffix
  let counter = 2;
  let candidate = `${baseSlug}-${counter}`;

  while (await slugExists(ctx, table, candidate)) {
    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }

  return candidate;
}

/**
 * Map Airtable status and published flag to Convex status.
 * @param airtableStatus - Airtable status field value
 * @param published - Airtable published checkbox value
 * @returns Convex status value
 */
export function mapStatus(
  airtableStatus: string | undefined,
  published: boolean | undefined,
): StatusType {
  // If published is true, always return 'published'
  if (published === true) {
    return 'published';
  }

  // Map status values
  switch (airtableStatus) {
    case 'Approved':
      return 'approved';
    case 'Pending':
      return 'backlog';
    case 'Declined':
    case 'Archived':
      return 'archived';
    default:
      return 'backlog';
  }
}

/**
 * Convert ISO date string to Unix timestamp (milliseconds).
 * @param isoDate - ISO date string or undefined
 * @returns Unix timestamp in milliseconds, or undefined if input is invalid
 */
export function parseTimestamp(isoDate: string | undefined): number | undefined {
  if (!isoDate) {
    return;
  }

  const timestamp = Date.parse(isoDate);

  if (Number.isNaN(timestamp)) {
    return;
  }

  return timestamp;
}

/**
 * Lookup Convex ID from Airtable record ID.
 * @param mapping - ID mapping
 * @param table - Table name
 * @param airtableId - Airtable record ID
 * @returns Convex document ID or undefined if not found
 */
export function lookupId<T extends keyof IdMapping>(
  mapping: IdMapping,
  table: T,
  airtableId: string | undefined,
): IdMapping[T] extends Map<string, infer U> ? U | undefined : never {
  if (!airtableId) {
    return undefined as IdMapping[T] extends Map<string, infer U> ? U | undefined : never;
  }

  return mapping[table].get(airtableId) as IdMapping[T] extends Map<string, infer U>
    ? U | undefined
    : never;
}
