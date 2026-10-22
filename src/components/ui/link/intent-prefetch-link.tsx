'use client';

import type { ComponentProps } from 'react';

import NextLink from 'next/link';

import { useIntentPrefetch } from './use-intent-prefetch';

function IntentPrefetchLink({
  href,
  onFocus,
  onMouseEnter,
  onTouchStart,
  ...delegated
}: ComponentProps<typeof NextLink>) {
  const intent = useIntentPrefetch(href, {
    onFocus,
    onMouseEnter,
    onTouchStart,
  });

  return <NextLink {...delegated} href={href} prefetch={false} {...intent} />;
}

export { IntentPrefetchLink };
