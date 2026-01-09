import { CenteredLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getCollections, getSpeakers } from '@/features/talks';
import { TalkForm } from '@/features/talks/components';
import { requireAdminUser } from '@/services/auth/server';

export default async function NewTalkPage() {
  await requireAdminUser('/login?redirect=/talks/new');

  const [collectionsResult, speakersResult] = await Promise.all([getCollections(), getSpeakers()]);
  const collections = collectionsResult.collections;
  const speakers = speakersResult.speakers;

  return (
    <CenteredLayout
      content={<TalkForm collections={collections} speakers={speakers} />}
      header={<PageHeader title="Create New Talk" />}
    />
  );
}
