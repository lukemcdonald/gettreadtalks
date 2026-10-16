import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import ManageCollectionsPage from '@/app/manage/collections/page';
import { CreateCollectionSheet } from '@/features/collections/components/create-collection-sheet';
import { ADMIN_LIST_PATHS, buildEntityNewPath } from '@/lib/entities/paths';

export default function Page() {
  return (
    <AdminSheetFallback
      returnPath={buildEntityNewPath('collections')}
      sheet={<CreateCollectionSheet closeHref={ADMIN_LIST_PATHS.collections} />}
    >
      <ManageCollectionsPage />
    </AdminSheetFallback>
  );
}
