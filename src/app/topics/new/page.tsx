import type { ManageListSearchParams } from '@/components/manage-table';

import { CreateTopicSheetRoute } from '@/app/@sheet/_components/create-topic-sheet-route';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import ManageTopicsPage from '@/app/manage/topics/page';
import { ADMIN_LIST_PATHS, buildEntityNewPath } from '@/lib/entities/paths';

export default function Page({
  searchParams,
}: {
  searchParams: Promise<ManageListSearchParams>;
}) {
  return (
    <AdminSheetFallback
      returnPath={buildEntityNewPath('topics')}
      sheet={<CreateTopicSheetRoute closeHref={ADMIN_LIST_PATHS.topics} />}
    >
      <ManageTopicsPage searchParams={searchParams} />
    </AdminSheetFallback>
  );
}
