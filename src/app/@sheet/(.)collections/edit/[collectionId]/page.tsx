import type { CollectionId } from '@/features/collections/types';

import { EditCollectionSheetPage } from '@/app/@sheet/_components/edit-collection-sheet-page';

interface PageProps {
  params: Promise<{ collectionId: CollectionId }>;
}

export default function Page({ params }: PageProps) {
  return <EditCollectionSheetPage params={params} />;
}
