import { CenteredLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getAllCollections } from '@/features/collections/queries/get-all-collections';
import { getAllSpeakers } from '@/features/speakers/queries/get-all-speakers';
import { TalkForm } from '@/features/talks/components/talk-form';
import { requireAdminUser } from '@/services/auth/server';

export default async function NewTalkPage() {
  await requireAdminUser('/login?redirect=/talks/new');

  const [collectionsResult, speakersResult] = await Promise.all([
    getAllCollections(),
    getAllSpeakers(),
  ]);

  const collections = collectionsResult.collections.map((item) => item.collection);
  const speakers = speakersResult.speakers;

  return (
    <CenteredLayout
      content={<TalkForm collections={collections} speakers={speakers} />}
      header={<PageHeader title="Create New Talk" />}
    />
  );
}
