import type { RenderOptions } from '@/test/render';
import type { ComponentProps } from 'react';

import { describe, expect, test } from 'vitest';

import { expectSpreadProps, render, screen, SPREAD_PROPS } from '@/test/render';

import { HeaderSearchDesktopTrigger } from './header-search-triggers';

describe('HeaderSearchDesktopTrigger', () => {
  const MOCK_HOTKEY = '⌘K';

  function setup(
    props: Partial<ComponentProps<typeof HeaderSearchDesktopTrigger>> & {
      'data-spread'?: string;
    } = {},
    options?: RenderOptions
  ) {
    return render(
      <HeaderSearchDesktopTrigger hotkey={MOCK_HOTKEY} {...props} />,
      options
    );
  }

  test('forwards extra button props onto the trigger', () => {
    setup(SPREAD_PROPS);

    const trigger = screen.getByRole('button', { name: 'Search' });

    expect(trigger).toHaveTextContent(MOCK_HOTKEY);
    expectSpreadProps(trigger);
  });
});
