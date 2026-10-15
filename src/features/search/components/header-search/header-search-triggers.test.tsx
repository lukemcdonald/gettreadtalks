import type { RenderOptions } from '@/test';
import type { ComponentProps } from 'react';

import { describe, expect, it, render, screen } from '@/test';

import { HeaderSearchDesktopTrigger } from './header-search-triggers';

describe('HeaderSearchDesktopTrigger', () => {
  const MOCK_HOTKEY = '⌘K';

  function setup(
    props: Partial<ComponentProps<typeof HeaderSearchDesktopTrigger>> = {},
    options?: RenderOptions
  ) {
    return render(
      <HeaderSearchDesktopTrigger hotkey={MOCK_HOTKEY} {...props} />,
      options
    );
  }

  it('renders the search hotkey', () => {
    setup();

    expect(screen.getByRole('button', { name: 'Search' })).toHaveTextContent(
      MOCK_HOTKEY
    );
  });

  it('spreads props onto the root element', () => {
    setup({ 'data-testid': 'custom' });

    expect(screen.getByRole('button', { name: 'Search' })).toHaveAttribute(
      'data-testid',
      'custom'
    );
  });
});
