import type { Speaker } from '@/features/speakers/types';

import { Suspense } from 'react';

import { SpeakersList } from '@/app/speakers/_components/speakers-list';
import { SpeakersListSkeleton } from '@/app/speakers/_components/speakers-skeleton';

type SpeakersContentProps = {
  speakers: Speaker[];
};

export function SpeakersContent({ speakers }: SpeakersContentProps) {
  return (
    <Suspense fallback={<SpeakersListSkeleton />}>
      <SpeakersList speakers={speakers} />
    </Suspense>
  );
}
