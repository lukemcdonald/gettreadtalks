'use client';

import { useSearchParams } from 'next/navigation';

const EXCLUDED_PARAMS = new Set(['cursor', 'search', 'sort']);

/** Returns the count of active filter URL params, excluding search, sort, and pagination. */
export function useActiveFilterCount(): number {
  const searchParams = useSearchParams();
  let count = 0;

  for (const [key, value] of searchParams.entries()) {
    if (!EXCLUDED_PARAMS.has(key) && value) {
      count++;
    }
  }

  return count;
}
