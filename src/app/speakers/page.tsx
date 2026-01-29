import { SpeakersList } from '@/app/speakers/_components/speakers-list';
import { SpeakersSidebar } from '@/app/speakers/_components/speakers-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { getSpeakers } from '@/features/speakers/queries/get-speakers';
import { getSpeakersGrouped } from '@/features/speakers/queries/get-speakers-grouped';

interface SpeakersPageProps {
  searchParams: Promise<{
    role?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function SpeakersPage({ searchParams }: SpeakersPageProps) {
  const params = await searchParams;

  const { role, search, sort } = params;

  const [speakerGroups, { speakers }] = await Promise.all([
    getSpeakersGrouped({ role, search, sort }),
    getSpeakers(),
  ]);

  const hasActiveFilters = Boolean(search || role);

  return (
    <SidebarLayout
      content={<SpeakersList groups={speakerGroups} hasActiveFilters={hasActiveFilters} />}
      sidebar={<SpeakersSidebar speakers={speakers} />}
      sidebarSticky
    />
  );
}
