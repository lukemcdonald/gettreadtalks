import type { Doc, Id, TableNames } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import type { StatusType } from './validators/shared';

import { getOneFrom } from 'convex-helpers/server/relationships';

import { throwNotFound } from './errors';

/**
 * Normalizes text into a URL-friendly slug
 * @param text - The text to normalize (can be undefined, null, or empty string)
 * @returns A normalized slug string, or empty string if input is falsy
 */
export function slugify(text: string | undefined | null): string {
  if (!text) {
    return '';
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Tables that have a 'by_slug' index
type SlugTable = 'affiliateLinks' | 'clips' | 'collections' | 'speakers' | 'talks' | 'topics';

/**
 * Check if a slug already exists in a table
 * @param ctx - Database context (QueryCtx or MutationCtx)
 * @param table - Table name (must have a 'by_slug' index)
 * @param slug - Slug to check
 * @param excludeId - Optional ID to exclude from check (for updates)
 * @returns True if slug exists, false otherwise
 */
export async function slugExists(
  ctx: QueryCtx | MutationCtx,
  table: SlugTable,
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const existing = await getOneFrom(ctx.db, table, 'by_slug', slug);

  if (!existing) {
    return false;
  }

  // If excludeId is provided, check if it's the same record
  if (excludeId && existing._id === excludeId) {
    return false;
  }

  return true;
}

/**
 * Check if a talk slug already exists for a specific speaker.
 * This allows multiple speakers to have talks with the same slug.
 *
 * @param ctx - Database context (QueryCtx or MutationCtx)
 * @param speakerId - Speaker ID to check within
 * @param slug - Talk slug to check
 * @param excludeId - Optional talk ID to exclude from check (for updates)
 * @returns True if slug exists for this speaker, false otherwise
 */
export async function talkSlugExistsForSpeaker(
  ctx: QueryCtx | MutationCtx,
  speakerId: Id<'speakers'>,
  slug: string,
  excludeId?: Id<'talks'>,
) {
  const speakerTalks = await ctx.db
    .query('talks')
    .withIndex('by_speakerId_and_status', (q) => q.eq('speakerId', speakerId))
    .collect();

  const existing = speakerTalks.find((talk) => {
    if (talk.slug !== slug) {
      return false;
    }

    // If we're updating a talk, exclude the current talk from the check
    if (excludeId && talk._id === excludeId) {
      return false;
    }

    return true;
  });

  return existing !== undefined;
}

/**
 * Generate a unique slug for a table, appending numeric suffix if needed.
 *
 * @param ctx - Database context (QueryCtx or MutationCtx)
 * @param table - Table name with 'by_slug' index
 * @param baseText - Text to generate slug from
 * @param excludeId - Optional ID to exclude from check (for updates)
 * @returns Unique slug string
 */
export async function generateSlug(
  ctx: QueryCtx | MutationCtx,
  table: SlugTable,
  baseText: string,
  excludeId?: string,
) {
  const baseSlug = slugify(baseText);
  const baseSlugExists = await slugExists(ctx, table, baseSlug, excludeId);

  if (!baseSlugExists) {
    return baseSlug;
  }

  let counter = 2;
  let candidateSlug = `${baseSlug}-${counter}`;

  // Try with numeric suffix
  while (await slugExists(ctx, table, candidateSlug, excludeId)) {
    counter += 1;
    candidateSlug = `${baseSlug}-${counter}`;
  }

  return candidateSlug;
}

/**
 * Extract value from a Promise.allSettled result with a fallback.
 *
 * @param result - PromiseSettledResult from Promise.allSettled
 * @param fallback - Value to return if promise was rejected
 * @returns The fulfilled value or the fallback
 */
export function getSettledValue<T, F = T>(result: PromiseSettledResult<T>, fallback: F): T | F {
  return result.status === 'fulfilled' ? result.value : fallback;
}

/**
 * Gets an entity by ID or throws NotFound error.
 * Eliminates repetitive null checking boilerplate.
 */
export async function getOrThrow<T extends TableNames>(
  ctx: QueryCtx | MutationCtx,
  table: T,
  id: Id<T>,
): Promise<Doc<T>> {
  const entity = await ctx.db.get(table, id);

  if (!entity) {
    throwNotFound(`${table} not found`, {
      resource: table,
      resourceId: id,
    });
  }

  return entity;
}

/**
 * Calculates publishedAt timestamp based on status change.
 * Returns existing timestamp if already published, Date.now() if transitioning to published, or undefined for other statuses.
 */
export function getPublishedAtForStatus(
  newStatus: StatusType,
  currentPublishedAt?: number,
): number | undefined {
  if (newStatus === 'published') {
    return currentPublishedAt ?? Date.now();
  }
  return;
}

/**
 * Shuffles an array and returns a limited number of items.
 * Uses Fisher-Yates shuffle via Array.sort() for simplicity.
 */
export function shuffleAndLimit<T>(items: T[], limit: number): T[] {
  return items.sort(() => Math.random() - 0.5).slice(0, limit);
}
