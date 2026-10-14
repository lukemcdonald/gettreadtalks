import type { Speaker } from '@/features/speakers/types';
import type { ReactNode } from 'react';

import { describe, expect, test, vi } from 'vitest';

import { useToggleSpeakerFavorited } from '@/features/users/hooks/use-toggle-speaker-favorited';
import { render, screen } from '@/test/render';

import { FavoriteSpeakerButton } from './favorite-speaker-button';

vi.mock('convex/react', () => ({
  Authenticated: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('@/features/users/hooks/use-toggle-speaker-favorited', () => ({
  useToggleSpeakerFavorited: vi.fn(),
}));

const speaker: Pick<Speaker, '_id' | 'slug'> = {
  _id: 'speakers:john-doe' as Speaker['_id'],
  slug: 'john-doe',
};

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

describe('FavoriteSpeakerButton', () => {
  test('favorites a speaker that is not saved yet', async () => {
    const toggle = mockToggle({ isFavorited: false });
    const { user } = render(<FavoriteSpeakerButton speaker={speaker} />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-pressed', 'false');

    await user.click(button);

    expect(toggle).toHaveBeenCalledTimes(1);
  });

  test('unfavorites a saved speaker', async () => {
    const toggle = mockToggle({ isFavorited: true });
    const { user } = render(<FavoriteSpeakerButton speaker={speaker} />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-pressed', 'true');

    await user.click(button);

    expect(toggle).toHaveBeenCalledTimes(1);
  });
});
