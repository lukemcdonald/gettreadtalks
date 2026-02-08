import type { Doc, Id, TableNames } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import type { StatusType } from './types';

import { asyncMap } from 'convex-helpers';
import { getOneFrom } from 'convex-helpers/server/relationships';

import { throwNotFound } from './errors';

/**
 * Normalizes text into a URL-friendly slug.
 * Returns empty string if input is falsy.
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
 * Check if a slug already exists in a table.
 * @param excludeId - Exclude this ID from check (useful for updates)
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
 * Allows multiple speakers to have talks with the same slug.
 * @param excludeId - Exclude this talk ID from check (useful for updates)
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
 * @param excludeId - Exclude this ID from uniqueness check (useful for updates)
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
 * Manually paginate an array with cursor support.
 * Returns page, continuation cursor, and done status.
 */
export function paginateArray<T>(
  items: T[],
  cursor: string | null,
  numItems: number,
): { continueCursor: string; isDone: boolean; page: T[] } {
  const startIndex = cursor ? Number.parseInt(cursor, 10) : 0;
  const endIndex = startIndex + numItems;
  const page = items.slice(startIndex, endIndex);
  const hasMore = endIndex < items.length;

  return {
    continueCursor: hasMore ? endIndex.toString() : '',
    isDone: !hasMore,
    page,
  };
}

/**
 * Delete all items from the database in a loop.
 * Used for cascade deletions of related records.
 */
export async function deleteAll<T extends { _id: Id<TableNames> }>(
  ctx: MutationCtx,
  items: T[],
): Promise<void> {
  for (const item of items) {
    await ctx.db.delete(item._id);
  }
}

/**
 * Apply text search filter to array of items with a title field.
 * Generic utility for client-side text filtering.
 */
export function applySearchFilter<T extends { title: string }>(items: T[], search?: string): T[] {
  if (!search) {
    return items;
  }
  const searchLower = search.toLowerCase();
  return items.filter((item) => item.title.toLowerCase().includes(searchLower));
}

/**
 * Enrich items with speaker data.
 * Works with any entity that has a speakerId field (talks, clips, etc).
 */
export async function enrichWithSpeakers<T extends { speakerId: Id<'speakers'> }>(
  ctx: QueryCtx,
  items: T[],
): Promise<Array<T & { speaker: Doc<'speakers'> | null }>> {
  return await asyncMap(items, async (item: T) => {
    const speaker = await ctx.db.get('speakers', item.speakerId);
    return { ...item, speaker };
  });
}
