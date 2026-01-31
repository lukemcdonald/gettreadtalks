import type { ComponentProps } from 'react';

import NextLink from 'next/link';

type LinkProps = ComponentProps<typeof NextLink>;

export function Link({ rel, target, ...props }: LinkProps) {
  const isBlank = target === '_blank';
  const resolvedRel = isBlank ? (rel ?? 'noopener noreferrer') : rel;

  return <NextLink rel={resolvedRel} target={target} {...props} />;
}
