import Link from 'next/link';
import { notFound } from 'next/navigation';

import { MainLayout } from '@/components/main-layout';
import { Button } from '@/components/ui/button';
import { getTalkBySlug } from '@/lib/features/talks';
import { getCurrentUser } from '@/lib/services/auth/server';
import { ClipsList } from './_components/clips-list';
import { CollectionInfo } from './_components/collection-info';
import { FavoriteTalkButton } from './_components/favorite-talk-button';
import { SpeakerInfo } from './_components/speaker-info';
import { TalkDetails } from './_components/talk-details';
import { TopicsList } from './_components/topics-list';

interface TalkPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TalkPage({ params }: TalkPageProps) {
  const { slug } = await params;
  const [talkData, user] = await Promise.all([getTalkBySlug(slug), getCurrentUser()]);

  if (!talkData) {
    notFound();
  }

  const { talk, speaker, collection, clips, topics } = talkData;

  return (
    <MainLayout>
      <header className="mb-4 flex items-center justify-between">
        <h1 className="font-bold text-2xl">{talk.title}</h1>
        <div className="flex items-center gap-2">
          {user && (
            <Button render={<Link href={`/talks/${slug}/edit`} />} variant="outline">
              Edit
            </Button>
          )}
          <FavoriteTalkButton talkId={talk._id} />
        </div>
      </header>

      <TalkDetails talk={talk} />

      {topics.length > 0 && <TopicsList topics={topics} />}
      {speaker && <SpeakerInfo speaker={speaker} />}
      {collection && <CollectionInfo collection={collection} />}
      {clips.length > 0 && <ClipsList clips={clips} />}
    </MainLayout>
  );
}
