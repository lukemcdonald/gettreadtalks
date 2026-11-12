/// <reference types="vitest/globals" />

import type { Speaker } from '@/features/speakers/types';
import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { ManageStudiesContent } from '@/app/manage/talks/studies/_components/studies-content';
import { buildTalkStudyPath } from '@/features/talks/utils';
import { describe, expect, it, render, screen } from '@/test';

const { loadAllTalksMock } = vi.hoisted(() => ({
  loadAllTalksMock: vi.fn(),
}));

vi.mock('@/features/talks/queries/load-all-talks', () => ({
  loadAllTalks: loadAllTalksMock,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    prefetch: vi.fn(),
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('ManageStudiesContent', () => {
  const talk = {
    _creationTime: 1,
    _id: 'talks:justification' as TalkWithSpeakerAndTopics['_id'],
    collectionTitle: 'Romans',
    featured: true,
    featuredClipTitle: 'Grace Clip',
    scripture: 'Romans 3:21-26',
    slug: 'justification',
    speaker: {
      _id: 'speakers:john-piper' as Speaker['_id'],
      firstName: 'John',
      lastName: 'Piper',
      slug: 'john-piper',
    } as Speaker,
    status: 'published',
    title: 'Justification',
    topicSlugs: ['justification', 'grace'],
  } as TalkWithSpeakerAndTopics;

  it('requests only the selected study status', async () => {
    loadAllTalksMock.mockResolvedValue({
      continueCursor: '',
      isDone: true,
      talks: [],
    });

    render(
      await ManageStudiesContent({
        searchParams: Promise.resolve({
          cursor: '10',
          search: 'grace',
          study: 'published',
        }),
      })
    );

    expect(loadAllTalksMock).toHaveBeenCalledWith({
      cursor: '10',
      limit: 50,
      search: 'grace',
      status: 'all',
      studyStatus: 'published',
    });
  });

  it('opens the study editor and does not archive or delete the talk', async () => {
    loadAllTalksMock.mockResolvedValue({
      continueCursor: '',
      isDone: true,
      talks: [talk],
    });

    render(
      await ManageStudiesContent({
        searchParams: Promise.resolve({}),
      })
    );

    expect(loadAllTalksMock).toHaveBeenCalledWith({
      cursor: undefined,
      limit: 50,
      search: undefined,
      status: 'all',
      studyStatus: 'draft',
    });
    expect(screen.getByRole('link', { name: talk.title })).toHaveAttribute(
      'href',
      buildTalkStudyPath(talk._id)
    );
    expect(
      screen.queryByRole('button', { name: 'More actions' })
    ).not.toBeInTheDocument();
  });
});
