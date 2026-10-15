import type { RenderOptions as RtlRenderOptions } from '@testing-library/react';
import type { Options as UserEventOptions } from '@testing-library/user-event';
import type { ReactElement, ReactNode } from 'react';

import { render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';

export { expectTracked, expectTrackedTimes, mockedTrack } from './analytics';
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  test,
  vi,
} from 'vitest';

export const SPREAD_PROPS = {
  'data-spread': 'forwarded',
} as const;

export type RenderOptions = Omit<RtlRenderOptions, 'wrapper'> & {
  userEvent?: UserEventOptions;
};

function Providers({ children }: { children: ReactNode }) {
  return children;
}

export function render(
  ui: ReactElement,
  { userEvent: userEventOptions, ...options }: RenderOptions = {}
) {
  const result = rtlRender(ui, { ...options, wrapper: Providers });
  const user = userEvent.setup(userEventOptions);

  return { ...result, ...user };
}

export function expectSpreadProps(element: HTMLElement) {
  expect(element).toHaveAttribute('data-spread', 'forwarded');
}
