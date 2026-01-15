import { notFound } from 'next/navigation';

import { EditTalkContent } from '@/app/talks/[speaker]/[talk]/edit/_components/edit-talk-content';
import { CenteredLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getAllCollections } from '@/features/collections';
import { getAllSpeakers } from '@/features/speakers';
import { getTalkBySlug } from '@/features/talks/queries';
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
  const [collectionsResult, speakersResult] = await Promise.all([
    getAllCollections(),
    getAllSpeakers(),
  ]);
  const collections = collectionsResult.collections.map((item) => item.collection);
  const speakers = speakersResult.speakers;

  return (
    <CenteredLayout
      content={
        <EditTalkContent
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
          talk={talk}
          talkSlug={talk.slug}
        />
      }
      header={<PageHeader title="Edit Talk" />}
    />
  );
}
