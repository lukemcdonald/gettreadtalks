import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DetailPageLayout, SectionContainer } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getTalkBySlug } from '@/lib/features/talks';
import { getCurrentUser } from '@/lib/services/auth/server';
import { ClipsList } from './_components/clips-list';
import { CollectionInfo } from './_components/collection-info';
import { FavoriteTalkButton } from './_components/favorite-talk-button';
import { SpeakerInfo } from './_components/speaker-info';
import { TalkDetails } from './_components/talk-details';
import { TopicsList } from './_components/topics-list';

type TalkPageProps = {
  params: Promise<{ talk: string }>;
};

export default async function TalkPage({ params }: TalkPageProps) {
  const { talk: slug } = await params;
  const [talkData, user] = await Promise.all([getTalkBySlug(slug), getCurrentUser()]);

  if (!talkData) {
    notFound();
  }

  const { talk, speaker, collection, clips, topics } = talkData;

  return (
    <DetailPageLayout>
      <SectionContainer>
        <PageHeader
          actions={
            <div className="flex items-center gap-2">
              {user && (
                <Button render={<Link href={`/talks/${slug}/edit`} />} variant="outline">
                  Edit
                </Button>
              )}
              <FavoriteTalkButton talkId={talk._id} />
            </div>
          }
          breadcrumbs={[
            { href: '/', label: 'Home' },
            { href: '/talks/', label: 'Talks' },
            { href: `/talks/${slug}`, label: talk.title },
          ]}
          title={talk.title}
        />

        <TalkDetails talk={talk} />

        <Separator />

        <div className="space-y-6">
          {topics.length > 0 && <TopicsList topics={topics} />}
          {speaker && <SpeakerInfo speaker={speaker} />}
          {collection && <CollectionInfo collection={collection} />}
          {clips.length > 0 && <ClipsList clips={clips} />}
        </div>
      </SectionContainer>
    </DetailPageLayout>
  );
}
