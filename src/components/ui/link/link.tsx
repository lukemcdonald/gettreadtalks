import type { ComponentProps } from 'react';

import NextLink from 'next/link';

import { getRel } from './rel';

type LinkProps = ComponentProps<typeof NextLink>;

export function Link({ rel, target, ...delegated }: LinkProps) {
  return <NextLink rel={getRel(target, rel)} target={target} {...delegated} />;
}
