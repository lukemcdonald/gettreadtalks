'use client';

import type { SearchHit } from '@/features/search/types';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useHeaderSearchAnalytics } from '@/features/search/analytics';
import { useDebouncedSearchQuery } from '@/features/search/hooks/use-debounced-search-query';
import { useHeaderSearchHandlers } from '@/features/search/hooks/use-header-search-handlers';
import { useHeaderSearchHotkeys } from '@/features/search/hooks/use-header-search-hotkeys';
import { useSearchSite } from '@/features/search/hooks/use-search-site';
import {
  getHeaderSearchState,
  SEARCH_DROPDOWN_LIMIT,
  toSearchHits,
} from '@/features/search/utils';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';

export { useSearchHotkeyLabel } from './use-search-hotkey-label';

export function useHeaderSearch() {
  const { data: user } = useCurrentUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useDebouncedSearchQuery(value);
  const { isLoading, results } = useSearchSite(
    debouncedQuery,
    SEARCH_DROPDOWN_LIMIT
  );
  const hits = toSearchHits(results);
  const hasQuery = value.trim().length > 0;
  const isPending = isLoading || value.trim() !== debouncedQuery;
  const [previousHits, setPreviousHits] = useState<SearchHit[] | null>(null);
  const { groups, status } = getHeaderSearchState({
    hits,
    isPending,
    isSignedIn: Boolean(user),
    previousHits,
    value,
  });
  const { trackSelection } = useHeaderSearchAnalytics({
    debouncedQuery,
    hitsLength: hits.length,
    isPending,
    open,
  });

  useHeaderSearchHotkeys(setOpen);

  const { handleOpenChange, handleSelect, handleValueChange } =
    useHeaderSearchHandlers({
      hasQuery,
      hits,
      isPending,
      previousHits,
      router,
      setDebouncedQuery,
      setOpen,
      setPreviousHits,
      setValue,
      trackSelection,
      value,
    });

  return {
    groups,
    handleOpenChange,
    handleSelect,
    handleValueChange,
    isLoading: hasQuery && isPending,
    open,
    status,
    value,
  };
}
