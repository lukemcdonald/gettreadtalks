'use client';

import { useEffect, useState } from 'react';

import { SEARCH_DEBOUNCE_MS } from '@/features/search/utils';

export function useDebouncedSearchQuery(value: string) {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(value.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  return [debouncedQuery, setDebouncedQuery] as const;
}
