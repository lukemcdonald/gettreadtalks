/// <reference types="vitest/globals" />

import { ClipsResults } from '@/app/clips/_components/clips-results';
import { PUBLIC_LISTING_PAGE_SIZE } from '@/constants/ui';
import { describe, expect, it } from '@/test';

const { loadClipsMock } = vi.hoisted(() => ({
  loadClipsMock: vi.fn(),
}));

vi.mock('@/features/clips/queries/load-clips', () => ({
  loadClips: loadClipsMock,
}));

vi.mock('@/app/clips/_components/clips-content', () => ({
  ClipsContent: () => null,
}));

describe('ClipsResults', () => {
  it('loads one public listing page', async () => {
    loadClipsMock.mockResolvedValue({
      clips: [],
      continueCursor: '',
      isDone: true,
    });

    await ClipsResults({ searchParams: Promise.resolve({}) });

    expect(loadClipsMock).toHaveBeenCalledWith({
      cursor: undefined,
      limit: PUBLIC_LISTING_PAGE_SIZE,
    });
  });

  it('forwards the listing cursor', async () => {
    loadClipsMock.mockResolvedValue({
      clips: [],
      continueCursor: 'page-three',
      isDone: false,
    });

    await ClipsResults({
      searchParams: Promise.resolve({ cursor: 'page-two' }),
    });

    expect(loadClipsMock).toHaveBeenCalledWith({
      cursor: 'page-two',
      limit: PUBLIC_LISTING_PAGE_SIZE,
    });
  });
});
