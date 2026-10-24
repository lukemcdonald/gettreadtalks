'use client';

import { useSyncExternalStore } from 'react';

import { formatSearchHotkeyLabel } from '@/features/search/utils';

function formatClientSearchHotkeyLabel() {
  if (typeof window === 'undefined') {
    return formatServerSearchHotkeyLabel();
  }

  return formatSearchHotkeyLabel(navigator.userAgent);
}

function formatServerSearchHotkeyLabel() {
  return '⌘K';
}

function subscribeSearchHotkey() {
  return () => {};
}

export function useSearchHotkeyLabel() {
  return useSyncExternalStore(
    subscribeSearchHotkey,
    formatClientSearchHotkeyLabel,
    formatServerSearchHotkeyLabel
  );
}
