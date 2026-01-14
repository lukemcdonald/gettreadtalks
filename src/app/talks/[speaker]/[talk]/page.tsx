import { notFound } from 'next/navigation';

import { TalkContent } from '@/app/talks/[speaker]/[talk]/_components/talk-content';
import { TalkSidebar } from '@/app/talks/[speaker]/[talk]/_components/talk-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { getTalkBySlug } from '@/features/talks/queries';
import { getCurrentUser } from '@/services/auth/server';

type TalkPageProps = {
  params: Promise<{ speaker: string; talk: string }>;
};

export default async function TalkPage({ params }: TalkPageProps) {
  const { speaker: speakerSlug, talk: talkSlug } = await params;
  const [talkData, user] = await Promise.all([
    getTalkBySlug(speakerSlug, talkSlug),
    getCurrentUser(),
  ]);

  if (!talkData) {
    notFound();
  }

  const { talk, speaker, collection, clips, topics } = talkData;

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
          user={user}
        />
      }
    />
  );
}
