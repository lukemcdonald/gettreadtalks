import { TopicContent } from '@/app/topics/[topicSlug]/_components/topic-content';
import { getTopicBySlug } from '@/features/topics/queries/get-topic-by-slug';

interface TopicTalksSearchParams {
  cursor?: string;
  search?: string;
}

interface TopicTalksProps {
  searchParams: Promise<TopicTalksSearchParams>;
  topicSlug: string;
}

export async function TopicTalks({ searchParams, topicSlug }: TopicTalksProps) {
  const { cursor, search } = await searchParams;
  const topicResult = await getTopicBySlug({
    cursor,
    search,
    slug: topicSlug,
  });

  if (!topicResult) {
    return null;
  }

  const { continueCursor, isDone, talks } = topicResult;

  return (
    <TopicContent
      continueCursor={continueCursor}
      hasNextPage={!isDone}
      hasPrevPage={!!cursor}
      talks={talks}
    />
  );
}
