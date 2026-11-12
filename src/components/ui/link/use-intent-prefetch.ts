'use client';

import type NextLink from 'next/link';
import type { ComponentProps, FocusEvent, MouseEvent, TouchEvent } from 'react';

import { useRouter } from 'next/navigation';

import { getPrefetchPath } from './get-prefetch-path';

type Href = ComponentProps<typeof NextLink>['href'];
interface IntentHandlers<Element extends HTMLElement> {
  onFocus?: (event: FocusEvent<Element>) => void;
  onMouseEnter?: (event: MouseEvent<Element>) => void;
  onTouchStart?: (event: TouchEvent<Element>) => void;
}

export function useIntentPrefetch<
  Element extends HTMLElement = HTMLAnchorElement,
>(href: Href, handlers: IntentHandlers<Element> = {}) {
  const router = useRouter();
  const path = getPrefetchPath(href);

  function prefetch() {
    if (path) {
      // PrefetchKind is an enum not exported from next/navigation.
      router.prefetch(path, {
        kind: 'full',
      } as Parameters<typeof router.prefetch>[1]);
    }
  }

  return {
    onFocus: (event: FocusEvent<Element>) => {
      prefetch();
      handlers.onFocus?.(event);
    },
    onMouseEnter: (event: MouseEvent<Element>) => {
      prefetch();
      handlers.onMouseEnter?.(event);
    },
    onTouchStart: (event: TouchEvent<Element>) => {
      prefetch();
      handlers.onTouchStart?.(event);
    },
  };
}
