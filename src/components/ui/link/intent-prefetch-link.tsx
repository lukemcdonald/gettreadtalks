'use client';

import type { ComponentProps } from 'react';

import NextLink from 'next/link';
import { useState } from 'react';

import { getPrefetchPath } from './get-prefetch-path';

function IntentPrefetchLink({
  href,
  onFocus,
  onMouseEnter,
  onTouchStart,
  ...delegated
}: ComponentProps<typeof NextLink>) {
  const [prefetch, setPrefetch] = useState(false);

  function enablePrefetch() {
    if (getPrefetchPath(href)) {
      setPrefetch(true);
    }
  }

  return (
    <NextLink
      {...delegated}
      href={href}
      onFocus={(event) => {
        enablePrefetch();
        onFocus?.(event);
      }}
      onMouseEnter={(event) => {
        enablePrefetch();
        onMouseEnter?.(event);
      }}
      onTouchStart={(event) => {
        enablePrefetch();
        onTouchStart?.(event);
      }}
      prefetch={prefetch}
    />
  );
}

export { IntentPrefetchLink };
