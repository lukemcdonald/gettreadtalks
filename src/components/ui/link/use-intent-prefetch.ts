'use client';

import type NextLink from 'next/link';
import type { ComponentProps, FocusEvent, MouseEvent } from 'react';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const prefetched = new Set<string>();

type Href = ComponentProps<typeof NextLink>['href'];
interface IntentHandlers<Element extends HTMLElement> {
  onFocus?: (event: FocusEvent<Element>) => void;
  onMouseEnter?: (event: MouseEvent<Element>) => void;
}

function getHrefPath(href: Href) {
  return typeof href === 'string' ? href : (href.pathname ?? '');
}

function prefetchOnce(prefetch: (href: string) => void, path: string) {
  if (!path || prefetched.has(path)) {
    return;
  }

  prefetched.add(path);
  prefetch(path);
}

export function useIntentPrefetch<
  Element extends HTMLElement = HTMLAnchorElement,
>(href: Href, handlers: IntentHandlers<Element> = {}) {
  const router = useRouter();
  const ref = useRef<Element>(null);
  const path = getHrefPath(href);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    function handleTouchStart() {
      prefetchOnce(router.prefetch, path);
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
    };
  }, [path, router.prefetch]);

  return {
    onFocus: (event: FocusEvent<Element>) => {
      prefetchOnce(router.prefetch, path);
      handlers.onFocus?.(event);
    },
    onMouseEnter: (event: MouseEvent<Element>) => {
      prefetchOnce(router.prefetch, path);
      handlers.onMouseEnter?.(event);
    },
    ref,
  };
}
