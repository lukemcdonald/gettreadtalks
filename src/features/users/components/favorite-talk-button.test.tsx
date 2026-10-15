/// <reference types="vitest/globals" />

import type { Talk } from '@/features/talks/types';
import type { RenderOptions } from '@/test';
import type { ComponentProps, ReactNode } from 'react';

import { useToggleTalkFavorited } from '@/features/users/hooks/use-toggle-talk-favorited';
import { describe, expect, it, render } from '@/test';

import { FavoriteTalkButton } from './favorite-talk-button';

vi.mock('@/features/users/hooks/use-toggle-talk-favorited', () => ({
  useToggleTalkFavorited: vi.fn(),
}));

vi.mock('convex/react', () => ({
  Authenticated: ({ children }: { children: ReactNode }) => children,
}));

describe('FavoriteTalkButton', () => {
  const MOCK_TALK: Pick<Talk, '_id' | 'slug'> = {
    _id: 'talks:romans-8' as Talk['_id'],
    slug: 'romans-8',
  };

  function setup(
    props: Partial<ComponentProps<typeof FavoriteTalkButton>> = {},
    options?: RenderOptions
  ) {
    return render(<FavoriteTalkButton talk={MOCK_TALK} {...props} />, options);
  }

  function mockToggle(value: {
    isFavorited: boolean;
    isLoading?: boolean;
    toggle?: () => void;
  }) {
    const toggle = value.toggle ?? vi.fn();

    vi.mocked(useToggleTalkFavorited).mockReturnValue({
      isFavorited: value.isFavorited,
      isLoading: value.isLoading ?? false,
      toggle,
    });

    return toggle;
  }

  it('favorites a talk that is not saved yet', async () => {
    const toggle = mockToggle({ isFavorited: false });
    const { getByTestId, user } = setup();
    const button = getByTestId('favorite-talk');

    expect(button).toHaveAttribute('aria-pressed', 'false');

    await user.click(button);

    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it('unfavorites a saved talk and disables while loading', () => {
    mockToggle({ isFavorited: true, isLoading: true });
    const { getByTestId } = setup();
    const button = getByTestId('favorite-talk');

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toBeDisabled();
  });
});
