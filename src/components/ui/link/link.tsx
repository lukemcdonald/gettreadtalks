import type { ComponentProps } from 'react';

import NextLink from 'next/link';

import { IntentPrefetchLink } from './intent-prefetch-link';
import { getRel } from './rel';

type NextLinkProps = ComponentProps<typeof NextLink>;

type LinkProps = Omit<NextLinkProps, 'prefetch'> & {
  prefetch?: NextLinkProps['prefetch'] | 'intent';
};

export function Link({ prefetch, rel, target, ...delegated }: LinkProps) {
  const resolvedRel = getRel(target, rel);

  if (prefetch === 'intent') {
    return (
      <IntentPrefetchLink {...delegated} rel={resolvedRel} target={target} />
    );
  }

  return (
    <NextLink
      {...delegated}
      prefetch={prefetch}
      rel={resolvedRel}
      target={target}
    />
  );
}
