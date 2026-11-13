import { ClipsContent } from '@/app/clips/_components/clips-content';
import { PUBLIC_LISTING_PAGE_SIZE } from '@/constants/ui';
import { loadClips } from '@/features/clips/queries/load-clips';

export interface ClipsSearchParams {
  cursor?: string;
}

interface ClipsResultsProps {
  searchParams: Promise<ClipsSearchParams>;
}

export async function ClipsResults({ searchParams }: ClipsResultsProps) {
  const { cursor } = await searchParams;
  const result = await loadClips({
    cursor,
    limit: PUBLIC_LISTING_PAGE_SIZE,
  });

  return (
    <ClipsContent
      clips={result.clips}
      continueCursor={result.continueCursor}
      hasNextPage={!result.isDone}
      hasPrevPage={!!cursor}
    />
  );
}
