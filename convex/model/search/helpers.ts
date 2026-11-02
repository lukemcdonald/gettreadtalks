import type { QueryCtx } from '../../_generated/server';
import type { StatusFilterType } from '../../lib/types';
import type { PaginationOptions, PaginationResult } from 'convex/server';

import { paginateSearchOrList } from '../../lib/utils';
import { requireAdmin } from '../auth/helpers';

export const DEFAULT_SEARCH_LIMIT = 12;
export const LIST_SEARCH_LIMIT = 100;

export function normalizeSearchQuery(query: string) {
  return query.trim().replaceAll(/\s+/gu, ' ');
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
