import { SpeakersList } from '@/app/speakers/_components/speakers-list';
import { SpeakersSidebar } from '@/app/speakers/_components/speakers-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { getSpeakers, getSpeakersGrouped } from '@/features/speakers';

export type SpeakersPageSearchParams = {
  role?: string;
  search?: string;
  sort?: string;
};

type SpeakersPageProps = {
  searchParams: Promise<SpeakersPageSearchParams>;
};

export default async function SpeakersPage({ searchParams }: SpeakersPageProps) {
  const params = await searchParams;
  const { role, search, sort } = params;

  const hasActiveFilters = !!(search || (role && role !== 'all'));

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
