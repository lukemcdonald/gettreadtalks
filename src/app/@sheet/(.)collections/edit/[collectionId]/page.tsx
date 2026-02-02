import type { CollectionId } from '@/features/collections/types';

import { redirect } from 'next/navigation';

import { getCollection } from '@/features/collections/queries/get-collection';
import { EditCollectionSheetRoute } from './_components/edit-collection-sheet-route';

interface PageProps {
  params: Promise<{ collectionId: CollectionId }>;
}

export default async function Page({ params }: PageProps) {
  const { collectionId } = await params;
  const collection = await getCollection(collectionId);

  if (!collection) {
    redirect('/collections');
  }

  return <EditCollectionSheetRoute collection={collection} />;
}
