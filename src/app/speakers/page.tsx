import { SpeakersContent } from '@/app/speakers/_components/speakers-content';
import { SpeakersSidebar } from '@/app/speakers/_components/speakers-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { getSpeakersWithPublishedTalks } from '@/features/speakers';

export default async function SpeakersPage() {
  const { speakers } = await getSpeakersWithPublishedTalks();

  return (
    <SidebarLayout
      content={<SpeakersContent speakers={speakers} />}
      sidebar={<SpeakersSidebar speakers={speakers} />}
      sidebarSticky
    />
  );
}
