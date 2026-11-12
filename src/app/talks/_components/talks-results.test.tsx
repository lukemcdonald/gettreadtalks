/// <reference types="vitest/globals" />

import { TalksResults } from '@/app/talks/_components/talks-results';
import { PUBLIC_LISTING_PAGE_SIZE } from '@/constants/ui';
import { describe, expect, it } from '@/test';

const { loadTalksMock } = vi.hoisted(() => ({
  loadTalksMock: vi.fn(),
}));

vi.mock('@/features/talks/queries/load-talks', () => ({
  loadTalks: loadTalksMock,
}));

vi.mock('@/app/talks/_components/talks-content', () => ({
  TalksContent: () => null,
}));

describe('TalksResults', () => {
  it('loads one public listing page', async () => {
    loadTalksMock.mockResolvedValue({
      continueCursor: '',
      isDone: true,
      talks: [],
    });

    await TalksResults({ searchParams: Promise.resolve({}) });

    expect(loadTalksMock).toHaveBeenCalledWith({
      cursor: undefined,
      featured: false,
      limit: PUBLIC_LISTING_PAGE_SIZE,
      search: undefined,
      sort: undefined,
      speakerSlugs: undefined,
      topicSlugs: undefined,
    });
  });

  it('forwards the listing cursor', async () => {
    loadTalksMock.mockResolvedValue({
      continueCursor: 'page-three',
      isDone: false,
      talks: [],
    });

    await TalksResults({
      searchParams: Promise.resolve({ cursor: 'page-two' }),
    });

    expect(loadTalksMock).toHaveBeenCalledWith(
      expect.objectContaining({
        cursor: 'page-two',
        limit: PUBLIC_LISTING_PAGE_SIZE,
      })
    );
  });
});
