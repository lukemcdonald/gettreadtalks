import type { ManageClipsSearchParams } from '@/app/manage/clips/_components/clips-content';
import type { ClipId } from '@/features/clips/types';

import { EditClipSheetPage } from '@/app/@sheet/_components/edit-clip-sheet-page';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import ManageClipsPage from '@/app/manage/clips/page';
import { ADMIN_LIST_PATHS, buildEntityEditPath } from '@/lib/entities/paths';
import { parseStatusPrefill } from '@/lib/entities/status-prefill';

interface PageProps {
  params: Promise<{ clipId: ClipId }>;
  searchParams: Promise<ManageClipsSearchParams>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { clipId } = await params;
  const { status } = await searchParams;
  const statusPrefill = parseStatusPrefill(status);

  return (
    <AdminSheetFallback
      returnPath={buildEntityEditPath('clips', clipId, {
        status: statusPrefill,
      })}
      sheet={
        <EditClipSheetPage
          closeHref={ADMIN_LIST_PATHS.clips}
          params={params}
          searchParams={searchParams}
        />
      }
    >
      <ManageClipsPage searchParams={searchParams} />
    </AdminSheetFallback>
  );
}
