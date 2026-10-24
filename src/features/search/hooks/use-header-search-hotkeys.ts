'use client';

import type { HeaderSearchAction } from '@/features/search/header-search-state';
import type { Dispatch } from 'react';

import { useEffect } from 'react';

import {
  isSearchHotkey,
  OPEN_HEADER_SEARCH_EVENT,
} from '@/features/search/utils';

export function useHeaderSearchHotkeys(dispatch: Dispatch<HeaderSearchAction>) {
  useEffect(() => {
    function onOpenHeaderSearch() {
      dispatch({ type: 'open' });
    }

    function onWindowKeyDown(event: globalThis.KeyboardEvent) {
      if (!isSearchHotkey(event)) {
        return;
      }

      event.preventDefault();
      dispatch({ type: 'toggle' });
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
  }, [dispatch]);
}
