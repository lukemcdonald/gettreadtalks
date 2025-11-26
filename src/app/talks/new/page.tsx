import { redirect } from 'next/navigation';

import { Container } from '@/components/container';
import { Layout } from '@/components/layout';
import { Section } from '@/components/section';
import { getAllCollections, getAllSpeakers } from '@/features/talks';
import { getCurrentUser } from '@/services/auth/server';
import { TalkForm } from './_components/talk-form';

export default async function NewTalkPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/talks/new');
  }

  const [collections, speakers] = await Promise.all([getAllCollections(), getAllSpeakers()]);

  return (
    <Section py="xl">
      <Container className="mx-auto max-w-prose">
        <Layout>
          <Layout.Content>
            <h1 className="mb-6 font-semibold text-2xl">Create New Talk</h1>
            <TalkForm collections={collections} speakers={speakers} />
          </Layout.Content>
        </Layout>
      </Container>
    </Section>
  );
}
