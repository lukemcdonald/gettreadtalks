/// <reference types="vitest/globals" />

import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { describe, expect, it, render, screen } from '@/test';

import { TalkActionsMenu } from './talk-actions-menu';

const { archiveTalk, push, refresh } = vi.hoisted(() => ({
  archiveTalk: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
    refresh,
  }),
}));

vi.mock('@/features/talks/hooks/use-archive-talk', () => ({
  useArchiveTalk: () => ({
    mutateAsync: archiveTalk,
  }),
}));

vi.mock('@/features/talks/hooks/use-destroy-talk', () => ({
  useDestroyTalk: () => ({
    mutateAsync: vi.fn(),
  }),
}));

vi.mock('@/components/ui/primitives/toast', () => ({
  toastManager: {
    add: vi.fn(),
  },
}));

describe('TalkActionsMenu', () => {
  const talk = {
    _id: 'talks:justification' as TalkWithSpeakerAndTopics['_id'],
    slug: 'justification',
    status: 'published',
    title: 'Justification',
  } as TalkWithSpeakerAndTopics;

  it('archives without leaving the manage list', async () => {
    archiveTalk.mockImplementation(async () => {});

    const { click } = render(<TalkActionsMenu talk={talk} />);

    await click(screen.getByRole('button', { name: 'More actions' }));
    await click(screen.getByRole('menuitem', { name: 'Archive' }));

    expect(archiveTalk).toHaveBeenCalledWith({ talkId: talk._id });
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(push).not.toHaveBeenCalled();
  });
});
