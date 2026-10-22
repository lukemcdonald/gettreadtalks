'use client';

import type { ComponentProps } from 'react';

import { Link } from './link';
import { useIntentPrefetch } from './use-intent-prefetch';

function FauxLink({
  children,
  href,
  onFocus,
  onMouseEnter,
  onTouchStart,
  ...delegated
}: ComponentProps<typeof Link>) {
  const intent = useIntentPrefetch(href, {
    onFocus,
    onMouseEnter,
    onTouchStart,
  });

  return (
    <Link {...delegated} href={href} prefetch={false} {...intent}>
      <span className="absolute inset-0" />
      {children}
    </Link>
  );
}

export { FauxLink };
