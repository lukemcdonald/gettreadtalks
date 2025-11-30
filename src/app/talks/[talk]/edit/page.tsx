import { notFound } from 'next/navigation';

import { CenteredLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getAllCollections, getAllSpeakers, getTalkBySlug } from '@/features/talks';
import { requireAdminUser } from '@/services/auth/server';
import { TalkForm } from '../../new/_components/talk-form';

type EditTalkPageProps = {
  params: Promise<{ talk: string }>;
};

export default async function EditTalkPage({ params }: EditTalkPageProps) {
  const { talk: slug } = await params;

  await requireAdminUser(`/login?redirect=/talks/${slug}/edit`);

  const talkData = await getTalkBySlug(slug);

  if (!talkData) {
    notFound();
  }

  const { talk } = talkData;
  const [collections, speakers] = await Promise.all([getAllCollections(), getAllSpeakers()]);

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
          speakers={speakers}
          talkId={talk._id}
          talkSlug={talk.slug}
        />
      }
      header={<PageHeader title="Edit Talk" />}
    />
  );
}
