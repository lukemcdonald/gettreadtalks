import type { Collection } from '@/features/collections/types';

interface CollectionInfoProps {
  collection: Pick<Collection, 'title' | 'description'>;
}

export function CollectionInfo({ collection }: CollectionInfoProps) {
  return (
    <section className="mb-4">
      <h2 className="font-semibold text-lg">Collection</h2>
      <p>{collection.title}</p>
      {!!collection.description && <p>{collection.description}</p>}
    </section>
  );
}
