interface CollectionInfoProps {
  collection: {
    title: string;
    description?: string;
  };
}

export function CollectionInfo({ collection }: CollectionInfoProps) {
  return (
    <section className="mb-4">
      <h2 className="font-bold text-lg">Collection</h2>
      <p>{collection.title}</p>
      {collection.description && <p>{collection.description}</p>}
    </section>
  );
}
