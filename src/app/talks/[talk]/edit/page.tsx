import { notFound, redirect } from 'next/navigation';

import { Container } from '@/components/container';
import { Layout } from '@/components/layout';
import { Section } from '@/components/section';
import { getAllCollections, getAllSpeakers, getTalkBySlug } from '@/features/talks';
import { getCurrentUser } from '@/services/auth/server';
import { TalkForm } from '../../new/_components/talk-form';

type EditTalkPageProps = {
  params: Promise<{
    talk: string;
  }>;
};

export default async function EditTalkPage({ params }: EditTalkPageProps) {
  const { talk: slug } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?redirect=/talks/${slug}/edit`);
  }

  const talkData = await getTalkBySlug(slug);

  if (!talkData) {
    notFound();
  }

  const { talk } = talkData;
  const [collections, speakers] = await Promise.all([getAllCollections(), getAllSpeakers()]);

  return (
    <Section py="xl">
      <Container className="mx-auto max-w-prose">
        <Layout>
          <Layout.Content>
            <h1 className="mb-6 font-semibold text-2xl">Edit Talk</h1>

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
          </Layout.Content>
        </Layout>
      </Container>
    </Section>
  );
}
