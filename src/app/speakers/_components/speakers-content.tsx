import type { Speaker } from '@/features/speakers/types';

import { SpeakersList } from '@/app/speakers/_components/speakers-list';

export type SpeakerGroup = {
  items: Speaker[];
  letter: string;
  range: string;
};

type SpeakersContentProps = {
  groups: SpeakerGroup[];
  hasActiveFilters: boolean;
};

export function SpeakersContent({ groups, hasActiveFilters }: SpeakersContentProps) {
  return <SpeakersList groups={groups} hasActiveFilters={hasActiveFilters} />;
}
