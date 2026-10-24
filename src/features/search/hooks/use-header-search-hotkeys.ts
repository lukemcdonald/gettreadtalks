'use client';

import type { Dispatch, SetStateAction } from 'react';

import { useEffect } from 'react';

import {
  isSearchHotkey,
  OPEN_HEADER_SEARCH_EVENT,
} from '@/features/search/utils';

export function useHeaderSearchHotkeys(
  setOpen: Dispatch<SetStateAction<boolean>>
) {
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
  }, [setOpen]);
}
