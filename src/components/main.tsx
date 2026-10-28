import type { ComponentPropsWithoutRef } from 'react';

export function Main(delegated: ComponentPropsWithoutRef<'main'>) {
  return <main {...delegated} id="main" />;
}
