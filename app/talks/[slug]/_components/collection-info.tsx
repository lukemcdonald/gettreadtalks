import { Heading, Text } from '@/components/ui';

interface CollectionInfoProps {
  collection: {
    description?: string;
    title: string;
  };
}

export function CollectionInfo({ collection }: CollectionInfoProps) {
  return (
    <section className="space-y-2">
      <Heading as="h2" size="xl">
        Collection
      </Heading>
      <Text weight="medium">{collection.title}</Text>
      {collection.description && <Text color="neutral">{collection.description}</Text>}
    </section>
  );
}
