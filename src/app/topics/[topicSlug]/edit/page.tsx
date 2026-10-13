import { notFound } from 'next/navigation';

import { getTopicBySlug } from '@/features/topics/queries/get-topic-by-slug';
import { redirectPublicEdit } from '@/lib/entities/redirect-public-edit';

interface PageProps {
  params: Promise<{ topicSlug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { topicSlug } = await params;
  const data = await getTopicBySlug({ slug: topicSlug });

  if (!data) {
    notFound();
  }

  await redirectPublicEdit({
    entity: 'topics',
    id: data.topic._id,
    publicPath: `/topics/${topicSlug}`,
  });
}
