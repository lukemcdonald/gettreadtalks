import { notFound } from 'next/navigation';

import { loadTopicBySlug } from '@/features/topics/queries/load-topic-by-slug';
import { buildTopicUrl } from '@/features/topics/utils';
import { redirectPublicEdit } from '@/lib/entities/redirect-public-edit';

interface PageProps {
  params: Promise<{ topicSlug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { topicSlug } = await params;
  const data = await loadTopicBySlug({ slug: topicSlug });

  if (!data) {
    notFound();
  }

  await redirectPublicEdit({
    entity: 'topics',
    id: data.topic._id,
    publicPath: buildTopicUrl(topicSlug),
  });
}
