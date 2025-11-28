import { SpeakersContent } from '@/app/speakers/_components/speakers-content';
import { SpeakersSidebar } from '@/app/speakers/_components/speakers-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { getAllSpeakers } from '@/features/speakers';

export default async function SpeakersPage() {
  const speakers = await getAllSpeakers();

  return (
    <SidebarLayout
      content={<SpeakersContent speakers={speakers} />}
      sidebar={<SpeakersSidebar speakers={speakers} />}
      sidebarSticky
    />
  );
}
