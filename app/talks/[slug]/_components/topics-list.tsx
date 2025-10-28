interface TopicsListProps {
  topics: Array<{
    _id: string;
    title: string;
  }>;
}

export function TopicsList({ topics }: TopicsListProps) {
  return (
    <section className="mb-4">
      <h2 className="text-lg font-bold">Topics</h2>
      <ul>
        {topics.map((topic) => (
          <li key={topic._id}>{topic.title}</li>
        ))}
      </ul>
    </section>
  );
}
