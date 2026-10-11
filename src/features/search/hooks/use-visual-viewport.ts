'use client';

import { useCallback, useSyncExternalStore } from 'react';

function getVisualViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

function getVisualViewportOffsetTop() {
  return window.visualViewport?.offsetTop ?? 0;
}

export function useVisualViewport(enabled: boolean) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!enabled) {
        return () => {};
      }

      const viewport = window.visualViewport;

      if (!viewport) {
        window.addEventListener('resize', onStoreChange);
        return () => {
          window.removeEventListener('resize', onStoreChange);
        };
      }

      viewport.addEventListener('resize', onStoreChange);
      viewport.addEventListener('scroll', onStoreChange);

      return () => {
        viewport.removeEventListener('resize', onStoreChange);
        viewport.removeEventListener('scroll', onStoreChange);
      };
    },
    [enabled]
  );

  return {
    height: useSyncExternalStore(subscribe, getVisualViewportHeight, () => 0),
    offsetTop: useSyncExternalStore(
      subscribe,
      getVisualViewportOffsetTop,
      () => 0
    ),
  };
}
