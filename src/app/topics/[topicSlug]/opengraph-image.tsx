import { notFound } from 'next/navigation';

import { getTopicBySlug } from '@/features/topics/queries/get-topic-by-slug';
import { shareImage } from '@/lib/og/share-image';
import { pluralize } from '@/utils';

export { alt, contentType, size } from '@/lib/og/share-image';

interface TopicShareImageProps {
  params: Promise<{ topicSlug: string }>;
}

export default async function Image({ params }: TopicShareImageProps) {
  const { topicSlug } = await params;
  const topicResult = await getTopicBySlug({ slug: topicSlug });

  if (!topicResult) {
    notFound();
  }

  const { topic, totalTalks } = topicResult;

  return shareImage({
    subtitle: `${totalTalks} ${pluralize(totalTalks, 'talk', 'talks')}`,
    title: topic.title,
  });
}
