'use client';

import type { CommandSearchItem, SearchHit } from '@/features/search/types';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';

import { useHeaderSearchAnalytics } from '@/features/search/analytics';
import { useSearchSite } from '@/features/search/hooks/use-search-site';
import {
  getHeaderSearchQueryAfterClose,
  getHeaderSearchState,
  getSearchHotkeyLabel,
  isSearchHotkey,
  OPEN_HEADER_SEARCH_EVENT,
  SEARCH_DEBOUNCE_MS,
  SEARCH_DROPDOWN_LIMIT,
  toSearchHits,
} from '@/features/search/utils';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';

function getClientSearchHotkeyLabel() {
  if (typeof window === 'undefined') {
    return getServerSearchHotkeyLabel();
  }

  return getSearchHotkeyLabel(navigator.userAgent);
}

function getServerSearchHotkeyLabel() {
  return '⌘K';
}

function subscribeSearchHotkey() {
  return () => {};
}

export function useSearchHotkeyLabel() {
  return useSyncExternalStore(
    subscribeSearchHotkey,
    getClientSearchHotkeyLabel,
    getServerSearchHotkeyLabel
  );
}

export function useHeaderSearch() {
  const { data: user } = useCurrentUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
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

  useEffect(() => {
    function onOpenHeaderSearch() {
      setOpen(true);
    }

    function onWindowKeyDown(event: globalThis.KeyboardEvent) {
      if (!isSearchHotkey(event)) {
        return;
      }

      event.preventDefault();
      setOpen((isOpen) => !isOpen);
    }

    const controller = new AbortController();
    const { signal } = controller;

    window.addEventListener('keydown', onWindowKeyDown, { signal });
    window.addEventListener(OPEN_HEADER_SEARCH_EVENT, onOpenHeaderSearch, {
      signal,
    });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(value.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  function close(didNavigate = false) {
    setOpen(false);
    setValue((query) => getHeaderSearchQueryAfterClose(query, didNavigate));

    if (didNavigate) {
      setDebouncedQuery('');
      setPreviousHits(null);
    }
  }

  function handleValueChange(nextValue: string) {
    if (!nextValue.trim()) {
      setPreviousHits(null);
    } else if (hasQuery && !isPending) {
      setPreviousHits(hits);
    }

    setValue(nextValue);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setOpen(true);
      return;
    }

    close();
  }

  function handleSelect(item: CommandSearchItem) {
    trackSelection({
      hits: isPending && previousHits !== null ? previousHits : hits,
      item,
      query: value,
    });
    router.push(item.href);
    close(true);
  }

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
