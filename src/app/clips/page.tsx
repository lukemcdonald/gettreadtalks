import { ClipsContent } from '@/app/clips/_components/clips-content';
import { ClipsSidebar } from '@/app/clips/_components/clips-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getClips } from '@/features/clips';
import { sortSpeakersByName } from '@/features/speakers';
import { getTopicsWithCounts } from '@/features/topics';

export default async function ClipsPage() {
  const [clipsResult, topics] = await Promise.all([getClips(), getTopicsWithCounts()]);

  const clips = clipsResult.clips;

  // Get unique speakers who have clips
  const allSpeakers = clips.map((clip) => clip.speaker).filter((speaker) => speaker !== null);
  const speakersWithClips = Array.from(
    new Map(allSpeakers.map((speaker) => [speaker.slug, speaker])).values(),
  );
  const sortedSpeakersWithClips = sortSpeakersByName(speakersWithClips);

  return (
    <SidebarLayout
      content={<ClipsContent clips={clips} />}
      header={
        <PageHeader
          description="Be encouraged by these short Christ centered clips."
          title="Clips"
          variant="lg"
        />
      }
      sidebar={<ClipsSidebar speakersWithClips={sortedSpeakersWithClips} topics={topics} />}
      sidebarSticky
    />
  );
}
