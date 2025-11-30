import type { SpeakerId } from '@/features/speakers/types';
import type { TalkStatus } from '@/features/talks/types';
import type { TopicId } from '@/features/topics/types';

import { TalksContent } from '@/app/talks/_components/talks-content';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';

export type TalksPageSearchParams = {
  cursor?: string;
  featured?: string;
  search?: string;
  speakerId?: SpeakerId;
  status?: TalkStatus;
  topicId?: TopicId;
};

type TalksPageProps = {
  searchParams: Promise<TalksPageSearchParams>;
};

export default async function TalksPage({ searchParams }: TalksPageProps) {
  const params = await searchParams;

  return (
    <SidebarLayout
      content={<TalksContent searchParams={params} />}
      sidebar={
        <PageHeader
          description="Elevate your spiritual heartbeat with Christ centered talks."
          title="Talks"
        />
      }
    />
  );
}
