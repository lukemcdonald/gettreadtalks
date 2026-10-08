import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import AccountCollectionsPage from '@/app/account/collections/page';
import { CreateCollectionSheet } from '@/features/collections/components/create-collection-sheet';
import { ADMIN_LIST_PATHS, getEntityNewPath } from '@/lib/entities/paths';

export default function Page() {
  return (
    <AdminSheetFallback
      returnPath={getEntityNewPath('collections')}
      sheet={<CreateCollectionSheet closeHref={ADMIN_LIST_PATHS.collections} />}
    >
      <AccountCollectionsPage />
    </AdminSheetFallback>
  );
}
