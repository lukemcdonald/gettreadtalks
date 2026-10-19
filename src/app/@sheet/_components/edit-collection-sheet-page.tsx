import type { CollectionId } from '@/features/collections/types';
import type { Route } from 'next';

import { redirect } from 'next/navigation';

import { EditCollectionSheetRoute } from '@/app/@sheet/_components/edit-collection-sheet-route';
import { loadCollection } from '@/features/collections/queries/load-collection';
import {
  ADMIN_LIST_PATHS,
  buildEntityEditPath,
  getLoginRedirect,
} from '@/lib/entities/paths';
import { requireAdminUser } from '@/services/auth/server';

interface EditCollectionSheetPageProps {
  closeHref?: string;
  params: Promise<{ collectionId: CollectionId }>;
}

export async function EditCollectionSheetPage({
  closeHref,
  params,
}: EditCollectionSheetPageProps) {
  const { collectionId } = await params;

  await requireAdminUser(
    getLoginRedirect(buildEntityEditPath('collections', collectionId)) as Route
  );

  const collection = await loadCollection(collectionId);

  if (!collection) {
    redirect(ADMIN_LIST_PATHS.collections);
  }

  return (
    <EditCollectionSheetRoute closeHref={closeHref} collection={collection} />
  );
}
