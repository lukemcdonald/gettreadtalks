import { describe, expect, it, render, screen, vi } from '@/test';

import { FormSheetSkeleton } from './form-sheet-skeleton';

describe('FormSheetSkeleton', () => {
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

  it.each([
    { label: 'below lg', matchesLg: false, side: 'down' },
    { label: 'at lg', matchesLg: true, side: 'right' },
  ] as const)('opens from the $side side $label', ({ matchesLg, side }) => {
    stubLgMediaQuery(matchesLg);

    render(<FormSheetSkeleton />);

    expect(screen.getByRole('dialog', { name: 'Loading' })).toHaveAttribute(
      'data-swipe-direction',
      side
    );
    expect(
      screen.queryByRole('button', { name: 'Cancel' })
    ).not.toBeInTheDocument();
  });
});
