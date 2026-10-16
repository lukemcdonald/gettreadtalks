/// <reference types="vitest/globals" />

import type { Speaker } from '@/features/speakers/types';

import { describe, expect, it, render, screen } from '@/test';

import { SpeakerHeroDetails } from './speaker-hero-details';

vi.mock('@/components/admin-edit-button', () => ({
  AdminEditButton: () => null,
}));

describe('SpeakerHeroDetails', () => {
  const speaker = {
    _creationTime: 1,
    _id: 'speakers:john-doe' as Speaker['_id'],
    firstName: 'John',
    lastName: 'Doe',
    role: 'Pastor',
    slug: 'john-doe',
  } as Speaker;

  it('shows the role under the name and keeps the Speakers back link', () => {
    render(<SpeakerHeroDetails speaker={speaker} />);

    expect(screen.getByRole('link', { name: 'Speakers' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'John Doe' })).toBeVisible();
    expect(screen.getByText('Pastor')).toBeVisible();
  });

  it('hides the role line when the speaker has no role', () => {
    render(<SpeakerHeroDetails speaker={{ ...speaker, role: undefined }} />);

    expect(screen.getByRole('heading', { name: 'John Doe' })).toBeVisible();
    expect(screen.queryByText('Pastor')).not.toBeInTheDocument();
  });
});
