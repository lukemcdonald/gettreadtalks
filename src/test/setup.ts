import type * as Analytics from '@/services/analytics';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { cleanup } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

vi.mock('@/services/analytics', async (importOriginal) => {
  const actual = await importOriginal<typeof Analytics>();

  return {
    ...actual,
    track: vi.fn(),
  };
});

vi.mock('next/link', () => ({
  default({
    children,
    href,
    ...delegated
  }: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    children?: ReactNode;
    href: string | { pathname?: string };
  }) {
    const nextLinkProps = new Set([
      'locale',
      'prefetch',
      'replace',
      'scroll',
      'shallow',
    ]);
    const anchorProps = Object.fromEntries(
      Object.entries(delegated).filter(([key]) => !nextLinkProps.has(key))
    );
    const resolvedHref =
      typeof href === 'string' ? href : (href.pathname ?? '/');

    return createElement('a', { ...anchorProps, href: resolvedHref }, children);
  },
}));
