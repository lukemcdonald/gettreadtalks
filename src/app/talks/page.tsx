import { TalksContent } from '@/app/talks/_components/talks-content';
import { TalksSidebar } from '@/app/talks/_components/talks-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { sortSpeakersByName } from '@/features/speakers';
import { getTalksWithSpeakers } from '@/features/talks';
import { getTopicsWithCounts } from '@/features/topics';

export default async function TalksPage() {
  const [talks, topics] = await Promise.all([getTalksWithSpeakers(), getTopicsWithCounts()]);

  // Get unique speakers who have talks
  const allSpeakers = talks.map((talk) => talk.speaker).filter((speaker) => speaker !== null);
  const speakersWithTalks = Array.from(
    new Map(allSpeakers.map((speaker) => [speaker.slug, speaker])).values(),
  );
  const sortedSpeakersWithTalks = sortSpeakersByName(speakersWithTalks);

  return (
    <SidebarLayout
      content={<TalksContent talks={talks} />}
      header={
        <PageHeader
          description="Elevate your spiritual heartbeat with Christ centered talks."
          title="Talks"
          variant="lg"
        />
      }
      sidebar={<TalksSidebar speakersWithTalks={sortedSpeakersWithTalks} topics={topics} />}
      sidebarSticky
    />
  );
}
