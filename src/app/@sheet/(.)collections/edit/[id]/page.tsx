import type { CollectionId } from '@/features/collections/types';

import { redirect } from 'next/navigation';

import { getCollectionForEdit } from '@/lib/sheets/queries';
import { EditCollectionSheetRoute } from './_components/edit-collection-sheet-route';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const collection = await getCollectionForEdit(id as CollectionId);

  if (!collection) {
    redirect('/collections');
  }

  return <EditCollectionSheetRoute collection={collection} />;
}
