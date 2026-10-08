import type { CollectionId } from '@/features/collections/types';

import { redirect } from 'next/navigation';

import { EditCollectionSheetRoute } from '@/app/@sheet/_components/edit-collection-sheet-route';
import { getCollection } from '@/features/collections/queries/get-collection';
import { ADMIN_LIST_PATHS } from '@/lib/entities/paths';

interface EditCollectionSheetPageProps {
  closeHref?: string;
  params: Promise<{ collectionId: CollectionId }>;
}

export async function EditCollectionSheetPage({
  closeHref,
  params,
}: EditCollectionSheetPageProps) {
  const { collectionId } = await params;
  const collection = await getCollection(collectionId);

  if (!collection) {
    redirect(ADMIN_LIST_PATHS.collections);
  }

  return (
    <EditCollectionSheetRoute closeHref={closeHref} collection={collection} />
  );
}
