import type { CollectionId } from '@/features/collections/types';

import { EditCollectionSheetPage } from '@/app/@sheet/_components/edit-collection-sheet-page';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import AccountCollectionsPage from '@/app/account/collections/page';
import { ADMIN_LIST_PATHS, getEntityEditPath } from '@/lib/entities/paths';

interface PageProps {
  params: Promise<{ collectionId: CollectionId }>;
}

export default async function Page({ params }: PageProps) {
  const { collectionId } = await params;

  return (
    <AdminSheetFallback
      returnPath={getEntityEditPath('collections', collectionId)}
      sheet={
        <EditCollectionSheetPage
          closeHref={ADMIN_LIST_PATHS.collections}
          params={params}
        />
      }
    >
      <AccountCollectionsPage />
    </AdminSheetFallback>
  );
}
