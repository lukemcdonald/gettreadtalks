/// <reference types="vitest/globals" />

import type { Talk, TalkWithTopicIds } from '@/features/talks/types';

import { describe, expect, it, render, screen } from '@/test';

import { EditTalkSheet } from './edit-talk-sheet';

const { updateTalkAction } = vi.hoisted(() => ({
  updateTalkAction: vi.fn(),
}));

vi.mock('convex/react', () => ({
  useAction: () => vi.fn(),
  useQuery: () => {},
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/talks/edit/talks:the-cross',
  useRouter: () => ({
    back: vi.fn(),
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/features/talks/actions/update-talk', () => ({
  updateTalkAction,
}));

vi.mock('@/features/talks/actions/update-talk-study', () => ({
  updateTalkFeatureAction: vi.fn(),
}));

vi.mock('@/features/speakers/actions/create-speaker', () => ({
  createSpeakerAction: vi.fn(),
}));

const speakerId = 'speakers:example' as Talk['speakerId'];

const talk = {
  _creationTime: 0,
  _id: 'talks:the-cross' as TalkWithTopicIds['_id'],
  mediaUrl: 'https://example.com/talk',
  slug: 'the-cross',
  speakerId,
  status: 'published',
  title: 'The Cross',
  topicIds: [],
} as TalkWithTopicIds;

function renderSheet(status: Talk['status'], statusPrefill?: 'archived') {
  return render(
    <EditTalkSheet
      collections={[]}
      speakers={[]}
      statusPrefill={statusPrefill}
      talk={{ ...talk, status }}
      topics={[]}
    />
  );
}

describe('EditTalkSheet status pre-fill', () => {
  it('shows an unsaved archived status and saves it', async () => {
    updateTalkAction.mockResolvedValue({
      data: { talkId: talk._id },
      success: true,
    });

    const { click } = renderSheet('published', 'archived');

    expect(screen.getByTestId('unsaved-status-notice')).toHaveTextContent(
      'Status was pre-filled as Archived and is not saved until you press Save.'
    );
    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent(
      'Archived'
    );

    await click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(updateTalkAction).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'archived' }),
      talk._id,
      undefined
    );
  });

  it('hides the notice when the talk is already archived', () => {
    renderSheet('archived', 'archived');

    expect(
      screen.queryByTestId('unsaved-status-notice')
    ).not.toBeInTheDocument();
  });
});
