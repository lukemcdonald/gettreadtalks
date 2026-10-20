import type { Clip } from '@/features/clips/types';
import type { Speaker } from '@/features/speakers/types';
import type { ComponentProps } from 'react';

import { describe, expect, it, render, screen } from '@/test';

import { ClipCard } from './clip-card';

describe('ClipCard', () => {
  const speaker = {
    firstName: 'John',
    lastName: 'Doe',
    slug: 'john-doe',
  } satisfies Pick<Speaker, 'firstName' | 'lastName' | 'slug'>;
  const clip = {
    slug: 'no-condemnation',
    title: 'No Condemnation',
  } satisfies Pick<Clip, 'slug' | 'title'>;

  function setup(props: Partial<ComponentProps<typeof ClipCard>> = {}) {
    return render(
      <ClipCard clip={{ ...clip, ...props.clip }} speaker={speaker} />
    );
  }

  it('shows the speaker and the source-talk scripture when both exist', () => {
    setup({
      clip: {
        ...clip,
        scripture: 'Romans 8:1',
      },
    });

    expect(screen.getByText('John Doe')).toBeVisible();
    expect(screen.getByText('Romans 8:1')).toBeVisible();
  });

  it('shows only the speaker when there is no scripture', () => {
    setup();

    expect(screen.getByText('John Doe')).toBeVisible();
    expect(screen.queryByText('Romans 8:1')).not.toBeInTheDocument();
  });
});
