import type { RenderOptions } from '@/test';
import type { ComponentProps } from 'react';

import {
  SPREAD_PROPS,
  describe,
  expect,
  expectSpreadProps,
  it,
  render,
} from '@/test';

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

  it('forwards extra button props onto the trigger', () => {
    const { getByRole } = setup(SPREAD_PROPS);
    const trigger = getByRole('button', { name: 'Search' });

    expect(trigger).toHaveTextContent(MOCK_HOTKEY);
    expectSpreadProps(trigger);
  });
});
