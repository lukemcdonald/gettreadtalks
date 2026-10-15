import type { Talk } from '@/features/talks/types';
import type { RenderOptions } from '@/test/render';
import type { ComponentProps, ReactNode } from 'react';

import { describe, expect, test, vi } from 'vitest';

import { useToggleTalkFavorited } from '@/features/users/hooks/use-toggle-talk-favorited';
import { render, screen, userEvent } from '@/test/render';

import { FavoriteTalkButton } from './favorite-talk-button';

vi.mock('convex/react', () => ({
  Authenticated: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('@/features/users/hooks/use-toggle-talk-favorited', () => ({
  useToggleTalkFavorited: vi.fn(),
}));

const talk: Pick<Talk, '_id' | 'slug'> = {
  _id: 'talks:romans-8' as Talk['_id'],
  slug: 'romans-8',
};

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

describe('FavoriteTalkButton', () => {
  function setup(
    props: Partial<ComponentProps<typeof FavoriteTalkButton>> = {},
    options?: RenderOptions
  ) {
    return {
      user: userEvent.setup(),
      ...render(<FavoriteTalkButton talk={talk} {...props} />, options),
    };
  }

  test('favorites a talk that is not saved yet', async () => {
    const toggle = mockToggle({ isFavorited: false });
    const { user } = setup();
    const button = screen.getByTestId('favorite-talk');

    expect(button).toHaveAttribute('aria-pressed', 'false');

    await user.click(button);

    expect(toggle).toHaveBeenCalledTimes(1);
  });

  test('unfavorites a saved talk and disables while loading', () => {
    mockToggle({ isFavorited: true, isLoading: true });
    setup();
    const button = screen.getByTestId('favorite-talk');

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toBeDisabled();
  });
});
