'use client';

import type { CommandSearchItem, SearchHit } from '@/features/search/types';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';

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
import { useIsMobile } from '@/hooks/use-media-query';

function getClientSearchHotkeyLabel() {
  return getSearchHotkeyLabel(navigator.userAgent);
}

function getServerSearchHotkeyLabel() {
  return '⌘K';
}

function subscribeSearchHotkey() {
  return () => {};
}

export function useHeaderSearch() {
  const hotkey = useSyncExternalStore(
    subscribeSearchHotkey,
    getClientSearchHotkeyLabel,
    getServerSearchHotkeyLabel
  );
  const isMobile = useIsMobile();
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

    window.addEventListener('keydown', onWindowKeyDown);
    window.addEventListener(OPEN_HEADER_SEARCH_EVENT, onOpenHeaderSearch);

    return () => {
      window.removeEventListener('keydown', onWindowKeyDown);
      window.removeEventListener(OPEN_HEADER_SEARCH_EVENT, onOpenHeaderSearch);
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
    router.push(item.href);
    close(true);
  }

  function handleOpenSearch() {
    setOpen(true);
  }

  return {
    groups,
    handleOpenChange,
    handleOpenSearch,
    handleSelect,
    handleValueChange,
    hotkey,
    isLoading: hasQuery && isPending,
    isMobile,
    open,
    status,
    value,
  };
}
