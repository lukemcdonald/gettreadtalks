import { notFound } from 'next/navigation';

import { getCollectionBySlug } from '@/features/collections/queries/get-collection-by-slug';
import { redirectPublicEdit } from '@/lib/entities/redirect-public-edit';

interface PageProps {
  params: Promise<{ collectionSlug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { collectionSlug } = await params;
  const data = await getCollectionBySlug(collectionSlug);

  if (!data) {
    notFound();
  }

  await redirectPublicEdit({
    entity: 'collections',
    id: data.collection._id,
    publicPath: `/collections/${collectionSlug}`,
  });
}
