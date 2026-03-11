'use client';

import NextTopLoader from 'nextjs-toploader';

export function NavigationProgress() {
  return <NextTopLoader color="var(--color-primary)" shadow={false} showSpinner={false} />;
}
