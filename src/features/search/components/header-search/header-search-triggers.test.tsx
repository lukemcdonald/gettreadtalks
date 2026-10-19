import type { RenderOptions, TestProps } from '@/test';
import type { ComponentProps } from 'react';

import { describe, expect, it, render, screen } from '@/test';

import {
  HeaderSearchDesktopTrigger,
  SearchHotkeyLabelText,
} from './header-search-triggers';

describe('HeaderSearchDesktopTrigger', () => {
  const MOCK_HOTKEY = '⌘K';

  function setup(
    props: TestProps<ComponentProps<typeof HeaderSearchDesktopTrigger>> = {},
    options?: RenderOptions
  ) {
    return render(
      <HeaderSearchDesktopTrigger hotkey={MOCK_HOTKEY} {...props} />,
      options
    );
  }

  it('renders the search hotkey', () => {
    setup();

    expect(
      screen.getByRole('button', { name: `Search ${MOCK_HOTKEY}` })
    ).toHaveTextContent(MOCK_HOTKEY);
  });

  it('keeps the Mac hotkey accessible name when reserving Ctrl K width', () => {
    render(
      <HeaderSearchDesktopTrigger
        hotkey={<SearchHotkeyLabelText>{MOCK_HOTKEY}</SearchHotkeyLabelText>}
      />
    );

    expect(
      screen.getByRole('button', { name: `Search ${MOCK_HOTKEY}` })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Ctrl K/u })
    ).not.toBeInTheDocument();
  });
});
