import type * as Analytics from '@/services/analytics';
import type * as Navigation from 'next/navigation';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { cleanup } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

const { router } = vi.hoisted(() => ({
  router: {
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  },
}));

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

vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof Navigation>();

  return {
    ...actual,
    useRouter: () => router,
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
