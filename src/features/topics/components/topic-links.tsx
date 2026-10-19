import type { Topic } from '@/features/topics/types';

import { Link } from '@/components/ui/link';
import { buildTopicPath } from '@/features/topics/utils';

interface TopicLinksProps {
  topics: Topic[];
}

export function TopicLinks({ topics }: TopicLinksProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((topic) => (
        <Link
          className="bg-muted text-foreground hover:bg-muted/80 inline-block rounded-full px-3 py-1.5 text-sm transition-colors"
          href={buildTopicPath(topic.slug)}
          key={topic._id}
        >
          {topic.title}
        </Link>
      ))}
    </div>
  );
}
