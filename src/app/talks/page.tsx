import type { SpeakerId } from '@/features/speakers/types';
import type { TopicId } from '@/features/topics/types';

import { TalksContent } from '@/app/talks/_components/talks-content';
import { TalksSidebar } from '@/app/talks/_components/talks-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getSpeakers, sortSpeakersByName } from '@/features/speakers';
import { getTopicsWithCounts } from '@/features/topics';

export type TalksPageSearchParams = {
  cursor?: string;
  featured?: string;
  search?: string;
  speaker?: string;
  topic?: string;
};

type TalksPageProps = {
  searchParams: Promise<TalksPageSearchParams>;
};

export default async function TalksPage({ searchParams }: TalksPageProps) {
  const params = await searchParams;

  // Fetch speakers and topics for filters (these don't depend on current filters)
  const [speakersResult, topics] = await Promise.all([getSpeakers(), getTopicsWithCounts()]);

  const speakers = speakersResult.speakers;
  const sortedSpeakers = sortSpeakersByName(speakers);

  return (
    <SidebarLayout
      content={<TalksContent searchParams={params} speakers={speakers} topics={topics} />}
      header={
        <PageHeader
          description="Elevate your spiritual heartbeat with Christ centered talks."
          title="Talks"
          variant="lg"
        />
      }
      sidebar={<TalksSidebar speakers={sortedSpeakers} topics={topics} />}
      sidebarSticky
    />
  );
}
