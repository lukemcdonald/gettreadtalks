/// <reference types="vitest/globals" />

import type { Speaker } from '@/features/speakers/types';

import { getSpeakerUrl } from '@/features/speakers/utils';
import { describe, expect, it, render, screen } from '@/test';

import { SpeakerActionsMenu } from './speaker-actions-menu';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/features/speakers/actions/destroy-speaker', () => ({
  destroySpeakerAction: vi.fn(),
}));

vi.mock('@/components/ui/primitives/toast', () => ({
  toastManager: {
    add: vi.fn(),
  },
}));

describe('SpeakerActionsMenu', () => {
  const speaker = {
    _id: 'speakers:john-piper' as Speaker['_id'],
    firstName: 'John',
    lastName: 'Piper',
    slug: 'john-piper',
  };

  it('shows View and Delete without Edit when published', async () => {
    const viewUrl = getSpeakerUrl(speaker.slug);
    const { click } = render(
      <SpeakerActionsMenu
        clipCount={0}
        speaker={speaker}
        talkCount={1}
        viewUrl={viewUrl}
      />
    );

    await click(screen.getByRole('button', { name: 'More actions' }));

    expect(screen.getByRole('menuitem', { name: 'View' })).toHaveAttribute(
      'href',
      viewUrl
    );
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeVisible();
    expect(
      screen.queryByRole('menuitem', { name: 'Edit' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { name: 'Archive' })
    ).not.toBeInTheDocument();
  });

  it('hides View when the speaker has no public page', async () => {
    const { click } = render(
      <SpeakerActionsMenu clipCount={0} speaker={speaker} talkCount={0} />
    );

    await click(screen.getByRole('button', { name: 'More actions' }));

    expect(
      screen.queryByRole('menuitem', { name: 'View' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeVisible();
  });
});
