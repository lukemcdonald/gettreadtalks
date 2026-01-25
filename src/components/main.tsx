import type { ComponentPropsWithoutRef } from 'react';

export function Main(props: ComponentPropsWithoutRef<'main'>) {
  return <main id="main" {...props} />;
}
