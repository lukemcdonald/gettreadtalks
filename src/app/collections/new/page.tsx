import type { ManageListSearchParams } from '@/components/manage-table';

import { CreateCollectionSheetRoute } from '@/app/@sheet/_components/create-collection-sheet-route';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import ManageCollectionsPage from '@/app/manage/collections/page';
import { ADMIN_LIST_PATHS, buildEntityNewPath } from '@/lib/entities/paths';

export default function Page({
  searchParams,
}: {
  searchParams: Promise<ManageListSearchParams>;
}) {
  return (
    <AdminSheetFallback
      returnPath={buildEntityNewPath('collections')}
      sheet={
        <CreateCollectionSheetRoute closeHref={ADMIN_LIST_PATHS.collections} />
      }
    >
      <ManageCollectionsPage searchParams={searchParams} />
    </AdminSheetFallback>
  );
}
