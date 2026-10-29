import type { ManageClipsSearchParams } from '@/app/manage/clips/_components/clips-content';

import { CreateClipSheetPage } from '@/app/@sheet/_components/create-clip-sheet-page';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import ManageClipsPage from '@/app/manage/clips/page';
import { ADMIN_LIST_PATHS, buildEntityNewPath } from '@/lib/entities/paths';

export default function Page({
  searchParams,
}: {
  searchParams: Promise<ManageClipsSearchParams>;
}) {
  return (
    <AdminSheetFallback
      returnPath={buildEntityNewPath('clips')}
      sheet={<CreateClipSheetPage closeHref={ADMIN_LIST_PATHS.clips} />}
    >
      <ManageClipsPage searchParams={searchParams} />
    </AdminSheetFallback>
  );
}
