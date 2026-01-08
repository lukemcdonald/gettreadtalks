import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { Suspense } from 'react';

import { TalksList, TalksListSkeleton } from '@/features/talks/components';

type TalkWithSpeaker = Talk & { speaker: Speaker | null };
type TalksContentProps = {
  talks: TalkWithSpeaker[];
};

export function TalksContent({ talks }: TalksContentProps) {
  return (
    <Suspense fallback={<TalksListSkeleton />}>
      <TalksList talks={talks} />
    </Suspense>
  );
}
