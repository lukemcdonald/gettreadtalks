import { ClipsContent } from '@/app/clips/_components/clips-content';
import { getClips } from '@/features/clips/queries/get-clips';

export interface ClipsSearchParams {
  cursor?: string;
}

interface ClipsResultsProps {
  searchParams: Promise<ClipsSearchParams>;
}

export async function ClipsResults({ searchParams }: ClipsResultsProps) {
  const { cursor } = await searchParams;
  const result = await getClips({ cursor });

  return (
    <ClipsContent
      clips={result.clips}
      continueCursor={result.continueCursor}
      hasNextPage={!result.isDone}
      hasPrevPage={!!cursor}
    />
  );
}
