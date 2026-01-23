import { SpeakersList } from '@/app/speakers/_components/speakers-list';
import { SpeakersSidebar } from '@/app/speakers/_components/speakers-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { getSpeakers, getSpeakersGrouped } from '@/features/speakers';

export interface SpeakersPageSearchParams {
  role?: string;
  search?: string;
  sort?: string;
}

interface SpeakersPageProps {
  searchParams: Promise<SpeakersPageSearchParams>;
}

export default async function SpeakersPage({ searchParams }: SpeakersPageProps) {
  const params = await searchParams;
  const { role, search, sort } = params;

  const hasActiveFilters = !!(search || role);

  const [groups, { speakers: allSpeakers }] = await Promise.all([
    getSpeakersGrouped({ role, search, sort }),
    getSpeakers(), // For sidebar (all speakers for role counts)
  ]);

  return (
    <SidebarLayout
      content={<SpeakersList groups={groups} hasActiveFilters={hasActiveFilters} />}
      sidebar={<SpeakersSidebar speakers={allSpeakers} />}
      sidebarSticky
    />
  );
}
