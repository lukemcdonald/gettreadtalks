import type { ComponentPropsWithoutRef } from 'react';

export function Main(delegated: ComponentPropsWithoutRef<'main'>) {
  return <main id="main" {...delegated} />;
}
