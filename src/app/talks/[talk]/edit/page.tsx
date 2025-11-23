import { notFound, redirect } from 'next/navigation';

import { MainLayout } from '@/components/layouts/main-layout';
import { getAllCollections, getAllSpeakers, getTalkBySlug } from '@/features/talks';
import { getCurrentUser } from '@/services/auth/server';
import { TalkForm } from '../../new/_components/talk-form';

type EditTalkPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditTalkPage({ params }: EditTalkPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/talks/[slug]/edit');
  }

  const { slug } = await params;
  const talkData = await getTalkBySlug(slug);

  if (!talkData) {
    notFound();
  }

  const { talk } = talkData;

  const [collections, speakers] = await Promise.all([getAllCollections(), getAllSpeakers()]);

  return (
    <MainLayout>
      <h1 className="mb-6 font-semibold text-2xl">Edit Talk</h1>
      <TalkForm
        collections={collections}
        initialData={{
          collectionId: talk.collectionId ?? null,
          collectionOrder: talk.collectionOrder ?? null,
          description: talk.description ?? null,
          featured: talk.featured ?? null,
          mediaUrl: talk.mediaUrl,
          scripture: talk.scripture ?? null,
          speakerId: talk.speakerId,
          status: talk.status,
          title: talk.title,
        }}
        speakers={speakers}
        talkId={talk._id}
        talkSlug={talk.slug}
      />
    </MainLayout>
  );
}
