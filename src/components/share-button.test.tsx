import type { RenderOptions } from '@/test';
import type { ComponentProps } from 'react';

import {
  afterEach,
  describe,
  expect,
  it,
  render,
  screen,
  userEvent,
  vi,
} from '@/test';

import { ShareButton } from './share-button';

describe('ShareButton', () => {
  const MOCK_TITLE = 'Romans 8';

  function setup(
    props: Partial<ComponentProps<typeof ShareButton>> = {},
    options?: RenderOptions
  ) {
    return {
      user: userEvent.setup(),
      ...render(<ShareButton title={MOCK_TITLE} {...props} />, options),
    };
  }

  function stubShare(share?: () => Promise<void>) {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share,
      writable: true,
    });
  }

  afterEach(() => {
    Reflect.deleteProperty(navigator, 'share');
  });

  it('uses the share API when it is available', async () => {
    const onShare = vi.fn();
    const share = vi.fn(() => Promise.resolve());
    stubShare(share);

    const { user } = setup({ onShare });

    await user.click(screen.getByRole('button'));

    expect(share).toHaveBeenCalledWith({
      title: MOCK_TITLE,
      url: window.location.href,
    });
    expect(onShare).toHaveBeenCalledTimes(1);
    expect(onShare).toHaveBeenCalledWith('share_api');
  });

  it('copies the URL when share is unavailable', async () => {
    const onShare = vi.fn();
    const writeText = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockImplementation(() => Promise.resolve());

    const { user } = setup({ onShare });

    await user.click(screen.getByRole('button'));

    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(onShare).toHaveBeenCalledWith('clipboard');
  });

  it('does not copy when the share sheet is dismissed', async () => {
    const onShare = vi.fn();
    const writeText = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockImplementation(() => Promise.resolve());
    const abortError = new Error('Abort');
    abortError.name = 'AbortError';
    stubShare(vi.fn().mockRejectedValue(abortError));

    const { user } = setup({ onShare });

    await user.click(screen.getByRole('button'));

    expect(onShare).not.toHaveBeenCalled();
    expect(writeText).not.toHaveBeenCalled();
  });
});
