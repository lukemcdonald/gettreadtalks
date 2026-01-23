import { notFound } from 'next/navigation';

import { TalkContent } from '@/app/talks/[speaker]/[talk]/_components/talk-content';
import { TalkSidebar } from '@/app/talks/[speaker]/[talk]/_components/talk-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { getTalkBySlug } from '@/features/talks/queries';
import { getCurrentUser } from '@/services/auth/server';

interface TalkPageProps {
  params: Promise<{ speaker: string; talk: string }>;
}

export default async function TalkPage({ params }: TalkPageProps) {
  const { speaker: speakerSlug, talk: talkSlug } = await params;

  const [talkResult, userResult] = await Promise.all([
    getTalkBySlug(speakerSlug, talkSlug),
    getCurrentUser(),
  ]);

  if (!talkResult) {
    notFound();
  }

  const { clips, collection, speaker, talk, topics } = talkResult;

  return (
    <SidebarLayout
      content={<TalkContent clips={clips} talk={talk} />}
      sidebar={
        <TalkSidebar
          clips={clips}
          collection={collection}
          speaker={speaker}
          talk={talk}
          topics={topics}
          user={userResult}
        />
      }
    />
  );
}
