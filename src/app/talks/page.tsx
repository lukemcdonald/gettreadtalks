import { TalksContent } from '@/app/talks/_components/talks-content';
import { TalksSidebar } from '@/app/talks/_components/talks-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { sortSpeakersByName } from '@/features/speakers';
import { getTalksWithSpeakers } from '@/features/talks';
import { getTopicsWithCounts } from '@/features/topics';

export type TalksPageSearchParams = {
  cursor?: string;
};

type TalksPageProps = {
  searchParams: Promise<TalksPageSearchParams>;
};

export default async function TalksPage({ searchParams }: TalksPageProps) {
  const params = await searchParams;
  const { cursor } = params;

  const [result, topics] = await Promise.all([
    getTalksWithSpeakers({ cursor }),
    getTopicsWithCounts(),
  ]);

  const allSpeakers = result.talks
    .map((talk) => talk.speaker)
    .filter((speaker) => speaker !== null);
  const speakersWithTalks = Array.from(
    new Map(allSpeakers.map((speaker) => [speaker.slug, speaker])).values(),
  );
  const sortedSpeakersWithTalks = sortSpeakersByName(speakersWithTalks);

  return (
    <SidebarLayout
      content={
        <TalksContent
          continueCursor={result.continueCursor}
          hasNextPage={!result.isDone}
          hasPrevPage={!!cursor}
          talks={result.talks}
        />
      }
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
