import { CenteredLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getAllCollections } from '@/features/collections/queries/get-all-collections';
import { getAllSpeakers } from '@/features/speakers/queries/get-all-speakers';
import { TalkForm } from '@/features/talks/components/talk-form';
import { getAllTopics } from '@/features/topics/queries/get-all-topics';
import { requireAdminUser } from '@/services/auth/server';

export default async function NewTalkPage() {
  await requireAdminUser('/login?redirect=/talks/new');

  const [{ collections }, { speakers }, { topics }] = await Promise.all([
    getAllCollections(),
    getAllSpeakers(),
    getAllTopics(),
  ]);

  const collectionItems = collections.map((item) => item.collection);
  const topicItems = topics.map((item) => ({
    _id: item.topic._id,
    slug: item.topic.slug,
    title: item.topic.title,
  }));

  return (
    <CenteredLayout
      content={
        <TalkForm
          collections={collectionItems}
          speakers={speakers}
          topics={topicItems}
        />
      }
      header={<PageHeader title="Create New Talk" />}
    />
  );
}
