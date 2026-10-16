/// <reference types="vitest/globals" />

import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { buildTalkUrl } from '@/features/talks/utils';
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
  const talkUrl = buildTalkUrl('john-piper', talk.slug);

  async function openMenu(viewUrl?: string) {
    const { click } = render(<TalkActionsMenu talk={talk} talkUrl={viewUrl} />);

    await click(screen.getByRole('button', { name: 'More actions' }));

    return click;
  }

  it('shows View, Archive, and Delete without Edit', async () => {
    await openMenu(talkUrl);

    expect(screen.getByRole('menuitem', { name: 'View' })).toHaveAttribute(
      'href',
      talkUrl
    );
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeVisible();
    expect(
      screen.queryByRole('menuitem', { name: 'Edit' })
    ).not.toBeInTheDocument();
  });

  it('hides View when the talk is not published', async () => {
    await openMenu();

    expect(
      screen.queryByRole('menuitem', { name: 'View' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeVisible();
  });

  it('archives without leaving the manage list', async () => {
    archiveTalk.mockImplementation(async () => {});

    const click = await openMenu(talkUrl);
    await click(screen.getByRole('menuitem', { name: 'Archive' }));

    expect(archiveTalk).toHaveBeenCalledWith({ talkId: talk._id });
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(push).not.toHaveBeenCalled();
  });
});
