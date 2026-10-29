import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';
import type { ComponentProps } from 'react';

import { describe, expect, it, render, screen } from '@/test';

import { TalkCard } from './talk-card';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    prefetch: vi.fn(),
  }),
}));

describe('TalkCard', () => {
  const speaker = {
    firstName: 'Jeff',
    lastName: 'Durbin',
    slug: 'jeff-durbin',
  } satisfies Pick<Speaker, 'firstName' | 'lastName' | 'slug'>;
  const talk = {
    slug: 'confronting-the-woke-church',
    title: 'Confronting the Woke Church',
  } satisfies Pick<Talk, 'slug' | 'title'>;

  function setup(props: Partial<ComponentProps<typeof TalkCard>> = {}) {
    return render(
      <TalkCard speaker={speaker} talk={{ ...talk, ...props.talk }} />
    );
  }

  it('shows the speaker and the scripture when both exist', () => {
    setup({
      talk: {
        ...talk,
        scripture: 'Acts 19:23-31',
      },
    });

    expect(screen.getByText('Jeff Durbin')).toBeVisible();
    expect(screen.getByText('Acts 19:23-31')).toBeVisible();
  });

  it('shows only the speaker when there is no scripture', () => {
    setup();

    expect(screen.getByText('Jeff Durbin')).toBeVisible();
    expect(screen.queryByText('Acts 19:23-31')).not.toBeInTheDocument();
  });

  it('defaults the title to an h2', () => {
    setup();

    expect(screen.getByRole('heading', { level: 2 })).toBeVisible();
  });

  it('renders the title at the given heading level', () => {
    render(<TalkCard headingLevel={3} speaker={speaker} talk={talk} />);

    expect(screen.getByRole('heading', { level: 3 })).toBeVisible();
  });
});
