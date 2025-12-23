import type { Clip } from '@/features/clips/types';

import { Suspense } from 'react';

import { ClipsList, ClipsListSkeleton } from '@/features/clips/components';

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
