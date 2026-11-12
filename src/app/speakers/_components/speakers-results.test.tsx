/// <reference types="vitest/globals" />

import { SpeakersResults } from '@/app/speakers/_components/speakers-results';
import { PUBLIC_LISTING_PAGE_SIZE } from '@/constants/ui';
import { describe, expect, it, render, screen } from '@/test';

const { loadSpeakersGroupedMock } = vi.hoisted(() => ({
  loadSpeakersGroupedMock: vi.fn(),
}));

vi.mock('@/features/speakers/queries/load-speakers-grouped', () => ({
  loadSpeakersGrouped: loadSpeakersGroupedMock,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/speakers',
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('SpeakersResults', () => {
  it('loads one public listing page', async () => {
    loadSpeakersGroupedMock.mockResolvedValue({
      continueCursor: '',
      groups: [],
      isDone: true,
    });

    render(await SpeakersResults({ searchParams: Promise.resolve({}) }));

    expect(loadSpeakersGroupedMock).toHaveBeenCalledWith({
      cursor: undefined,
      limit: PUBLIC_LISTING_PAGE_SIZE,
      role: undefined,
      search: undefined,
      sort: undefined,
    });
  });

  it('forwards the listing cursor and shows next when more remain', async () => {
    loadSpeakersGroupedMock.mockResolvedValue({
      continueCursor: 'page-two',
      groups: [
        {
          items: [
            {
              _id: 'speakers:jane-adams' as never,
              featured: false,
              firstName: 'Jane',
              lastName: 'Adams',
              role: 'Author',
              slug: 'jane-adams',
            },
          ],
          letter: 'A',
          range: 'Adams—Adams',
        },
      ],
      isDone: false,
    });

    render(
      await SpeakersResults({
        searchParams: Promise.resolve({ cursor: 'page-one' }),
      })
    );

    expect(loadSpeakersGroupedMock).toHaveBeenCalledWith({
      cursor: 'page-one',
      limit: PUBLIC_LISTING_PAGE_SIZE,
      role: undefined,
      search: undefined,
      sort: undefined,
    });
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
  });
});
