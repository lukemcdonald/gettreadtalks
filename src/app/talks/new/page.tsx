import { CenteredLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getAllCollections, getAllSpeakers } from '@/features/talks';
import { requireAdminUser } from '@/services/auth/server';
import { TalkForm } from './_components/talk-form';

export default async function NewTalkPage() {
  await requireAdminUser('/login?redirect=/talks/new');

  const [collections, speakers] = await Promise.all([getAllCollections(), getAllSpeakers()]);

  return (
    <CenteredLayout
      content={<TalkForm collections={collections} speakers={speakers} />}
      header={<PageHeader title="Create New Talk" />}
    />
  );
}
