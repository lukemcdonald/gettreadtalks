import { notFound } from 'next/navigation';

import { TalkForm } from '@/app/talks/new/_components/talk-form';
import { CenteredLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getCollections, getSpeakers, getTalkBySlug } from '@/features/talks';
import { requireAdminUser } from '@/services/auth/server';

type EditTalkPageProps = {
  params: Promise<{ speaker: string; talk: string }>;
};

export default async function EditTalkPage({ params }: EditTalkPageProps) {
  const { speaker: speakerSlug, talk: talkSlug } = await params;

  await requireAdminUser(`/login?redirect=/talks/${speakerSlug}/${talkSlug}/edit`);

  const talkData = await getTalkBySlug(speakerSlug, talkSlug);

  if (!talkData) {
    notFound();
  }

  const { talk, speaker } = talkData;
  const [collectionsResult, speakersResult] = await Promise.all([getCollections(), getSpeakers()]);
  const collections = collectionsResult.collections;
  const speakers = speakersResult.speakers;

  return (
    <CenteredLayout
      content={
        <TalkForm
          collections={collections}
          initialData={{
            collectionId: talk.collectionId,
            collectionOrder: talk.collectionOrder,
            description: talk.description,
            featured: talk.featured,
            mediaUrl: talk.mediaUrl,
            scripture: talk.scripture,
            speakerId: talk.speakerId,
            status: talk.status,
            title: talk.title,
          }}
          speakerSlug={speaker?.slug}
          speakers={speakers}
          talkId={talk._id}
          talkSlug={talk.slug}
        />
      }
      header={<PageHeader title="Edit Talk" />}
    />
  );
}
