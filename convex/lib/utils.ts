import type { Doc, Id, TableNames } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import type { StatusType } from './types';
import type { PaginationOptions, PaginationResult } from 'convex/server';

import { asyncMap } from 'convex-helpers';
import { getOneFrom } from 'convex-helpers/server/relationships';

import { throwNotFound } from './errors';

/**
 * Extracts a readable message from an unknown caught value.
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error';
}

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
    .replaceAll(/[^\w\s-]/gu, '')
    .replaceAll(/[\s_-]+/gu, '-')
    .replaceAll(/^-+|-+$/gu, '');
}

// Tables that have a 'by_slug' index
type SlugTable =
  | 'affiliateLinks'
  | 'clips'
  | 'collections'
  | 'speakers'
  | 'talks'
  | 'topics';

/**
 * Check if a slug already exists in a table.
 * @param excludeId - Exclude this ID from check (useful for updates)
 */
export async function slugExists(
  ctx: QueryCtx | MutationCtx,
  args: {
    excludeId?: string;
    slug: string;
    table: SlugTable;
  }
): Promise<boolean> {
  const existing = await getOneFrom(ctx.db, args.table, 'by_slug', args.slug);

  if (!existing) {
    return false;
  }

  // If excludeId is provided, check if it's the same record
  if (args.excludeId && existing._id === args.excludeId) {
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
  args: {
    excludeId?: Id<'talks'>;
    slug: string;
    speakerId: Id<'speakers'>;
  }
) {
  const speakerTalks = await ctx.db
    .query('talks')
    .withIndex('by_speakerId_and_status', (q) =>
      q.eq('speakerId', args.speakerId)
    )
    .collect();

  const existing = speakerTalks.find((talk) => {
    if (talk.slug !== args.slug) {
      return false;
    }

    // If we're updating a talk, exclude the current talk from the check
    if (args.excludeId && talk._id === args.excludeId) {
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
  args: {
    baseText: string;
    excludeId?: string;
    table: SlugTable;
  }
) {
  const baseSlug = slugify(args.baseText);
  const baseSlugExists = await slugExists(ctx, {
    excludeId: args.excludeId,
    slug: baseSlug,
    table: args.table,
  });

  if (!baseSlugExists) {
    return baseSlug;
  }

  let counter = 2;
  let candidateSlug = `${baseSlug}-${counter}`;

  // Try with numeric suffix
  while (
    // oxlint-disable-next-line no-await-in-loop -- each candidate depends on the previous uniqueness check
    await slugExists(ctx, {
      excludeId: args.excludeId,
      slug: candidateSlug,
      table: args.table,
    })
  ) {
    counter += 1;
    candidateSlug = `${baseSlug}-${counter}`;
  }

  return candidateSlug;
}

/**
 * Gets an entity by ID or throws NotFound error.
 * Eliminates repetitive null checking boilerplate.
 */
export async function getOrThrow<T extends TableNames>(
  ctx: QueryCtx | MutationCtx,
  args: {
    id: Id<T>;
    table: T;
  }
): Promise<Doc<T>> {
  const entity = await ctx.db.get(args.table, args.id);

  if (!entity) {
    throwNotFound(`${args.table} not found`, {
      resource: args.table,
      resourceId: args.id,
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
  currentPublishedAt?: number
): number | undefined {
  if (newStatus === 'published') {
    return currentPublishedAt ?? Date.now();
  }

  return undefined;
}

// Keep each read inside a normal Convex page, and stop a scan that never fills.
const MAX_PAGE_READS = 50;
const MAX_READ_SIZE = 1000;

/**
 * Read until `numItems` rows survive `accept`, or the source is done.
 * Rejected rows advance the cursor, so an empty filtered page does not end pagination.
 */
export async function loadFullPage<TSource, TItem>(
  loadPage: (
    paginationOpts: PaginationOptions
  ) => Promise<PaginationResult<TSource>>,
  accept: (items: TSource[]) => Promise<TItem[]> | TItem[],
  paginationOpts: PaginationOptions
): Promise<PaginationResult<TItem>> {
  const target = paginationOpts.numItems;
  const page: TItem[] = [];
  const readCap = Number.isFinite(target)
    ? MAX_PAGE_READS
    : Number.POSITIVE_INFINITY;
  let { cursor } = paginationOpts;
  let isDone = false;
  let continueCursor = '';

  for (
    let read = 0;
    page.length < target && !isDone && read < readCap;
    read += 1
  ) {
    const numItems = Math.min(MAX_READ_SIZE, target - page.length);
    // oxlint-disable-next-line no-await-in-loop -- the next cursor depends on this page
    const result = await loadPage({
      ...paginationOpts,
      cursor,
      numItems,
    });
    const {
      continueCursor: nextCursor,
      isDone: pageDone,
      page: sourcePage,
    } = result;
    // oxlint-disable-next-line no-await-in-loop -- acceptance can read documents on this page
    const accepted = await accept(sourcePage);

    page.push(...accepted);
    continueCursor = nextCursor;
    isDone = pageDone;

    if (nextCursor === cursor) {
      break;
    }

    cursor = nextCursor;
  }

  return {
    continueCursor,
    isDone,
    page,
  };
}

/** loadFullPage pages a paginated query; loadUntilFull reads an async stream (e.g. a search index). */
export async function loadUntilFull<T>(
  source: AsyncIterable<T>,
  accept: (item: T) => Promise<boolean> | boolean,
  limit: number
): Promise<T[]> {
  const page: T[] = [];

  if (limit < 1) {
    return page;
  }

  for await (const item of source) {
    // oxlint-disable-next-line no-await-in-loop -- stop once the page is full
    if (!(await accept(item))) {
      continue;
    }

    page.push(item);

    if (page.length >= limit) {
      break;
    }
  }

  return page;
}

/**
 * Manually paginate an array with cursor support.
 * Returns page, continuation cursor, and done status.
 */
export function paginateArray<T>(
  items: T[],
  cursor: string | null,
  numItems: number
): { continueCursor: string; isDone: boolean; page: T[] } {
  const startIndex = cursor ? Math.trunc(Number(cursor)) : 0;
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
 * Native Convex pagination when listing, or search-index hits then offset pages.
 */
export async function paginateSearchOrList<T>(options: {
  listPage: () => Promise<PaginationResult<T>>;
  paginationOpts: PaginationOptions;
  queryText: string;
  search: () => Promise<T[]>;
}): Promise<PaginationResult<T>> {
  const { listPage, paginationOpts, queryText, search } = options;

  if (queryText.length > 0) {
    const items = await search();

    return paginateArray(items, paginationOpts.cursor, paginationOpts.numItems);
  }

  return await listPage();
}

/**
 * Delete all items from the database in a loop.
 * Used for cascade deletions of related records.
 */
export async function deleteAll<T extends { _id: Id<TableNames> }>(
  ctx: MutationCtx,
  args: { items: T[] }
): Promise<void> {
  await Promise.all(args.items.map((item) => ctx.db.delete(item._id)));
}

/**
 * Drop admin-only draft text before a talk leaves a public query.
 */
export function toPublicTalk<T extends object>(talk: T): T {
  if (!('draftStudy' in talk) && !('draftSummary' in talk)) {
    return talk;
  }

  const publicTalk = { ...talk };
  delete (publicTalk as { draftStudy?: string }).draftStudy;
  delete (publicTalk as { draftSummary?: string }).draftSummary;

  return publicTalk;
}

/**
 * Attach the speaker for items that always have a speakerId (talks).
 */
export async function enrichWithSpeaker<
  T extends { speakerId: Id<'speakers'> },
>(
  ctx: QueryCtx,
  args: { items: T[] }
): Promise<(T & { speaker: Doc<'speakers'> | null })[]> {
  return await asyncMap(args.items, async (item: T) => {
    const speaker = await ctx.db.get('speakers', item.speakerId);

    return { ...toPublicTalk(item), speaker };
  });
}
