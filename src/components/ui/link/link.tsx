'use client';

import type { ComponentProps } from 'react';

import { useState } from 'react';
import NextLink from 'next/link';

type NextLinkProps = ComponentProps<typeof NextLink>;

type LinkProps = Omit<NextLinkProps, 'prefetch'> & {
  prefetch?: NextLinkProps['prefetch'] | 'hover';
};

export function Link({ prefetch, rel, target, onMouseEnter, ...delegated }: LinkProps) {
  const [hovered, setHovered] = useState(false);

  const isBlank = target === '_blank';
  const resolvedRel = isBlank ? (rel ?? 'noopener noreferrer') : rel;

  const isHoverPrefetch = prefetch === 'hover';
  const hoverPrefetchValue = hovered ? null : false;
  const resolvedPrefetch = isHoverPrefetch ? hoverPrefetchValue : prefetch;

  return (
    <NextLink
      onMouseEnter={(e) => {
        if (isHoverPrefetch) {
          setHovered(true);
        }
        onMouseEnter?.(e);
      }}
      prefetch={resolvedPrefetch}
      rel={resolvedRel}
      target={target}
      {...delegated}
    />
  );
}
