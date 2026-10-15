import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { describe, expect, it, screen, vi, waitFor } from '@/test';

import { useMediaQuery } from './use-media-query';

describe('useMediaQuery', () => {
  function MediaLabel() {
    const isDesktop = useMediaQuery('lg');

    return <p>{isDesktop ? 'Desktop layout' : 'Mobile layout'}</p>;
  }

  function stubLgMediaQuery(matches: boolean) {
    vi.stubGlobal('matchMedia', (query: string) => ({
      addEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
    }));
  }

  function collectHydrationErrors() {
    const hydrationErrors: string[] = [];
    const { error } = console;

    vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      const message = args
        .map((arg) => (typeof arg === 'string' ? arg : String(arg)))
        .join(' ');

      if (/hydrat/iu.test(message)) {
        hydrationErrors.push(message);
      }

      error.apply(console, args as Parameters<typeof error>);
    });

    return hydrationErrors;
  }

  it('renders the unmatched branch during SSR even when the query matches', () => {
    stubLgMediaQuery(true);

    expect(renderToString(<MediaLabel />)).toContain('Mobile layout');
  });

  it('hydrates unmatched server markup without a warning when the query matches', async () => {
    stubLgMediaQuery(true);

    const container = document.createElement('div');
    container.innerHTML = '<p>Mobile layout</p>';
    document.body.append(container);

    const hydrationErrors = collectHydrationErrors();
    const root = hydrateRoot(container, <MediaLabel />);

    await waitFor(() => {
      expect(screen.getByText('Desktop layout')).toBeInTheDocument();
    });

    expect(hydrationErrors).toEqual([]);

    root.unmount();
    container.remove();
  });
});
