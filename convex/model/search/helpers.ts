import type { QueryCtx } from '../../_generated/server';
import type { StatusFilterType } from '../../lib/types';
import type { PaginationOptions, PaginationResult } from 'convex/server';

import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { paginateSearchOrList } from '../../lib/utils';
import { publishStateFilter } from '../../lib/validators/shared';
import { requireAdmin } from '../auth/helpers';
import { normalizeSearchQuery } from './normalize';

export { normalizeSearchQuery } from './normalize';

export const adminListArgs = {
  paginationOpts: paginationOptsValidator,
  search: v.optional(v.string()),
  status: v.optional(publishStateFilter),
};

export const DEFAULT_SEARCH_LIMIT = 12;
export const LIST_SEARCH_LIMIT = 100;

/** Clamp a requested limit to 1..LIST_SEARCH_LIMIT. Invalid values use the default. */
export function normalizeSearchLimit(limit: number | undefined) {
  if (limit === undefined || !Number.isFinite(limit)) {
    return DEFAULT_SEARCH_LIMIT;
  }

  return Math.min(LIST_SEARCH_LIMIT, Math.max(1, Math.floor(limit)));
}

export function searchPhrases(query: string) {
  const normalized = normalizeSearchQuery(query);

  if (!normalized) {
    return [];
  }

  const phrases = [normalized];

  for (const token of normalized.split(' ')) {
    if (!phrases.includes(token)) {
      phrases.push(token);
    }
  }

  return phrases;
}

export function searchTitleQuery(queryText: string, status?: StatusFilterType) {
  return <
    T extends {
      eq: (field: 'status', value: Exclude<StatusFilterType, 'all'>) => T;
    },
  >(q: {
    search: (field: 'title', value: string) => T;
  }) => {
    const searched = q.search('title', queryText);

    if (status && status !== 'all') {
      return searched.eq('status', status);
    }

    return searched;
  };
}

export function uniqueById<T extends { _id: string }>(items: T[]) {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const item of items) {
    if (seen.has(item._id)) {
      continue;
    }

    seen.add(item._id);
    unique.push(item);
  }

  return unique;
}

export async function listAllAdmin<T, TPage>(
  ctx: QueryCtx,
  options: {
    enrich: (page: T[]) => Promise<TPage[]>;
    listPage: () => Promise<PaginationResult<T>>;
    paginationOpts: PaginationOptions;
    search?: string;
    searchItems: (queryText: string) => Promise<T[]>;
  }
): Promise<PaginationResult<TPage>> {
  const { enrich, listPage, paginationOpts, search, searchItems } = options;

  await requireAdmin(ctx);

  const queryText = normalizeSearchQuery(search ?? '');
  const result = await paginateSearchOrList({
    listPage,
    paginationOpts,
    queryText,
    search: () => searchItems(queryText),
  });

  return {
    ...result,
    page: await enrich(result.page),
  };
}

/**
 * Read a search stream until `limit` rows survive `accept`, or the source ends.
 * Convex allows only one `.paginate()` per query, so site search cannot use `loadFullPage`.
 */
export async function loadAccepted<T>(
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
