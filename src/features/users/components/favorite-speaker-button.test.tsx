/// <reference types="vitest/globals" />

import type { Speaker } from '@/features/speakers/types';
import type { RenderOptions } from '@/test';
import type { ComponentProps, ReactNode } from 'react';

import { useToggleSpeakerFavorited } from '@/features/users/hooks/use-toggle-speaker-favorited';
import { describe, expect, it, render } from '@/test';

import { FavoriteSpeakerButton } from './favorite-speaker-button';

vi.mock('@/features/users/hooks/use-toggle-speaker-favorited', () => ({
  useToggleSpeakerFavorited: vi.fn(),
}));

vi.mock('convex/react', () => ({
  Authenticated: ({ children }: { children: ReactNode }) => children,
}));

describe('FavoriteSpeakerButton', () => {
  const MOCK_SPEAKER: Pick<Speaker, '_id' | 'slug'> = {
    _id: 'speakers:john-doe' as Speaker['_id'],
    slug: 'john-doe',
  };

  function setup(
    props: Partial<ComponentProps<typeof FavoriteSpeakerButton>> = {},
    options?: RenderOptions
  ) {
    return render(
      <FavoriteSpeakerButton speaker={MOCK_SPEAKER} {...props} />,
      options
    );
  }

  function mockToggle(value: {
    isFavorited: boolean;
    isLoading?: boolean;
    toggle?: () => void;
  }) {
    const toggle = value.toggle ?? vi.fn();

    vi.mocked(useToggleSpeakerFavorited).mockReturnValue({
      isFavorited: value.isFavorited,
      isLoading: value.isLoading ?? false,
      toggle,
    });

    return toggle;
  }

  it('favorites a speaker that is not saved yet', async () => {
    const toggle = mockToggle({ isFavorited: false });
    const { getByRole, user } = setup();
    const button = getByRole('button');

    expect(button).toHaveAttribute('aria-pressed', 'false');

    await user.click(button);

    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it('unfavorites a saved speaker', async () => {
    const toggle = mockToggle({ isFavorited: true });
    const { getByRole, user } = setup();
    const button = getByRole('button');

    expect(button).toHaveAttribute('aria-pressed', 'true');

    await user.click(button);

    expect(toggle).toHaveBeenCalledTimes(1);
  });
});
