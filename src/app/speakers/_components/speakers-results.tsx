import { SpeakersList } from '@/features/speakers/components/speakers-list';
import { getSpeakersGrouped } from '@/features/speakers/queries/get-speakers-grouped';

export interface SpeakersSearchParams {
  role?: string;
  search?: string;
  sort?: string;
}

interface SpeakersResultsProps {
  searchParams: Promise<SpeakersSearchParams>;
}

export async function SpeakersResults({ searchParams }: SpeakersResultsProps) {
  const { role, search, sort } = await searchParams;
  const groups = await getSpeakersGrouped({ role, search, sort });
  const hasActiveFilters = !!(search || role);

  return <SpeakersList groups={groups} hasActiveFilters={hasActiveFilters} />;
}
