import type { ManageListSearchParams } from '@/components/manage-table';

import { CreateSpeakerSheetRoute } from '@/app/@sheet/_components/create-speaker-sheet-route';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import ManageSpeakersPage from '@/app/manage/speakers/page';
import { ADMIN_LIST_PATHS, buildEntityNewPath } from '@/lib/entities/paths';

export default function Page({
  searchParams,
}: {
  searchParams: Promise<ManageListSearchParams>;
}) {
  return (
    <AdminSheetFallback
      returnPath={buildEntityNewPath('speakers')}
      sheet={<CreateSpeakerSheetRoute closeHref={ADMIN_LIST_PATHS.speakers} />}
    >
      <ManageSpeakersPage searchParams={searchParams} />
    </AdminSheetFallback>
  );
}
