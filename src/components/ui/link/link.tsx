import type { ComponentProps } from 'react';

import NextLink from 'next/link';

type LinkProps = ComponentProps<typeof NextLink>;

export function Link({ rel, target, ...delegated }: LinkProps) {
  const isBlank = target === '_blank';
  const finalRel = isBlank ? (rel ?? 'noopener noreferrer') : rel;

  return <NextLink rel={finalRel} target={target} {...delegated} />;
}
