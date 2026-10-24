'use client';

import type { CommandSearchItem, SearchHit } from '@/features/search/types';
import type { Dispatch, SetStateAction } from 'react';

import { getHeaderSearchQueryAfterClose } from '@/features/search/utils';

interface HeaderSearchHandlersOptions {
  hasQuery: boolean;
  hits: SearchHit[];
  isPending: boolean;
  previousHits: SearchHit[] | null;
  router: { push: (href: string) => void };
  setDebouncedQuery: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setPreviousHits: Dispatch<SetStateAction<SearchHit[] | null>>;
  setValue: Dispatch<SetStateAction<string>>;
  trackSelection: (input: {
    hits: SearchHit[];
    item: CommandSearchItem;
    query: string;
  }) => void;
  value: string;
}

export function useHeaderSearchHandlers({
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
}: HeaderSearchHandlersOptions) {
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
    handleOpenChange,
    handleSelect,
    handleValueChange,
  };
}
