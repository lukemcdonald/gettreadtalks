import type { QueryCtx } from '../../_generated/server';
import type { PaginationOptions, PaginationResult } from 'convex/server';

import { paginateSearchOrList } from '../../lib/utils';
import { requireAdmin } from '../auth/roles';
import { normalizeSearchQuery } from './utils';

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
