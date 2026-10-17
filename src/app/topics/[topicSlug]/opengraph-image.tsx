import { notFound } from 'next/navigation';

import { loadTopicBySlug } from '@/features/topics/queries/load-topic-by-slug';
import { shareImage, sharePropsForTopic } from '@/lib/og/share-image';

export { alt, contentType, size } from '@/lib/og/share-image';

interface TopicShareImageProps {
  params: Promise<{ topicSlug: string }>;
}

export default async function Image({ params }: TopicShareImageProps) {
  const { topicSlug } = await params;
  const topicResult = await loadTopicBySlug({ slug: topicSlug });

  if (!topicResult) {
    notFound();
  }

  const { topic, totalTalks } = topicResult;

  return shareImage(
    sharePropsForTopic({
      talkCount: totalTalks,
      title: topic.title,
    })
  );
}
