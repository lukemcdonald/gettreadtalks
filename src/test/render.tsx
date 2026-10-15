import type { RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

import { render as rtlRender } from '@testing-library/react';
import { expect } from 'vitest';

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

export const SPREAD_PROPS = {
  'data-spread': 'forwarded',
} as const;

function Providers({ children }: { children: ReactNode }) {
  return children;
}

export function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return rtlRender(ui, { ...options, wrapper: Providers });
}

export function expectSpreadProps(element: HTMLElement) {
  expect(element).toHaveAttribute('data-spread', 'forwarded');
}
