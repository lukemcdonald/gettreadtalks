import { describe, expect, test } from 'vitest';

import { expectSpreadProps, render, screen, SPREAD_PROPS } from '@/test/render';

import { HeaderSearchDesktopTrigger } from './header-search-triggers';

describe('HeaderSearchDesktopTrigger', () => {
  test('forwards extra button props onto the trigger', () => {
    render(<HeaderSearchDesktopTrigger hotkey="⌘K" {...SPREAD_PROPS} />);

    const trigger = screen.getByRole('button', { name: 'Search' });

    expect(trigger).toHaveTextContent('⌘K');
    expectSpreadProps(trigger);
  });
});
