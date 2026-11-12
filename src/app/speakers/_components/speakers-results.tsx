import { SpeakersContent } from '@/app/speakers/_components/speakers-content';
import { PUBLIC_LISTING_PAGE_SIZE } from '@/constants/ui';
import { loadSpeakersGrouped } from '@/features/speakers/queries/load-speakers-grouped';

export interface SpeakersSearchParams {
  cursor?: string;
  role?: string;
  search?: string;
  sort?: string;
}

interface SpeakersResultsProps {
  searchParams: Promise<SpeakersSearchParams>;
}

export async function SpeakersResults({ searchParams }: SpeakersResultsProps) {
  const { cursor, role, search, sort } = await searchParams;
  const { continueCursor, groups, isDone } = await loadSpeakersGrouped({
    cursor,
    limit: PUBLIC_LISTING_PAGE_SIZE,
    role,
    search,
    sort,
  });

  return (
    <SpeakersContent
      continueCursor={continueCursor}
      groups={groups}
      hasActiveFilters={!!(search || role)}
      hasNextPage={!isDone}
      hasPrevPage={!!cursor}
    />
  );
}
