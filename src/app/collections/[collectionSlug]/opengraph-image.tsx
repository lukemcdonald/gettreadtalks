import { notFound } from 'next/navigation';

import { getCollectionBySlug } from '@/features/collections/queries/get-collection-by-slug';
import { shareImage, sharePropsForCollection } from '@/lib/og/share-image';

export { alt, contentType, size } from '@/lib/og/share-image';

interface CollectionShareImageProps {
  params: Promise<{ collectionSlug: string }>;
}

export default async function Image({ params }: CollectionShareImageProps) {
  const { collectionSlug } = await params;
  const data = await getCollectionBySlug(collectionSlug);

  if (!data) {
    notFound();
  }

  const { collection, talks } = data;

  return shareImage(
    sharePropsForCollection({
      talkCount: talks.length,
      title: collection.title,
    })
  );
}
