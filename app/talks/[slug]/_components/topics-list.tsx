import { Badge, Heading } from '@/components/ui';

interface TopicsListProps {
  topics: Array<{
    _id: string;
    title: string;
  }>;
}

export function TopicsList({ topics }: TopicsListProps) {
  return (
    <section className="space-y-2">
      <Heading as="h2" size="xl">
        Topics
      </Heading>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <Badge key={topic._id} variant="neutral" size="sm">
            {topic.title}
          </Badge>
        ))}
      </div>
    </section>
  );
}
