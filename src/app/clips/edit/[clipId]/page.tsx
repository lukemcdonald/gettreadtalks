import type { ClipId } from '@/features/clips/types';

import { EditClipSheetPage } from '@/app/@sheet/_components/edit-clip-sheet-page';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import AccountClipsPage from '@/app/account/clips/page';
import { ADMIN_LIST_PATHS, getEntityEditPath } from '@/lib/entities/paths';
import { parseStatusPrefill } from '@/lib/entities/status-prefill';

interface PageProps {
  params: Promise<{ clipId: ClipId }>;
  searchParams: Promise<{ status?: string | string[] }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { clipId } = await params;
  const { status } = await searchParams;

  return (
    <AdminSheetFallback
      returnPath={getEntityEditPath('clips', clipId, {
        status: parseStatusPrefill(status),
      })}
      sheet={
        <EditClipSheetPage
          closeHref={ADMIN_LIST_PATHS.clips}
          params={params}
          searchParams={searchParams}
        />
      }
    >
      <AccountClipsPage searchParams={Promise.resolve({})} />
    </AdminSheetFallback>
  );
}
