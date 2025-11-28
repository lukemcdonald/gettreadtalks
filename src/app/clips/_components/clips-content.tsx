import type { Clip } from '@/features/clips/types';

import { Suspense } from 'react';

import { ClipsList } from '@/app/clips/_components/clips-list';
import { ClipsListSkeleton } from '@/app/clips/_components/clips-skeleton';

type ClipsContentProps = {
  clips: Clip[];
};

export function ClipsContent({ clips }: ClipsContentProps) {
  return (
    <Suspense fallback={<ClipsListSkeleton />}>
      <ClipsList clips={clips} />
    </Suspense>
  );
}
