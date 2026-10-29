import type { ManageTalksSearchParams } from '@/app/manage/talks/_components/talks-content';
import type { TalkId } from '@/features/talks/types';

import { EditTalkSheetPage } from '@/app/@sheet/_components/edit-talk-sheet-page';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import ManageTalksPage from '@/app/manage/talks/page';
import { ADMIN_LIST_PATHS, buildEntityEditPath } from '@/lib/entities/paths';
import { parseStatusPrefill } from '@/lib/entities/status-prefill';

interface PageProps {
  params: Promise<{ talkId: TalkId }>;
  searchParams: Promise<ManageTalksSearchParams>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { talkId } = await params;
  const { status } = await searchParams;
  const statusPrefill = parseStatusPrefill(status);

  return (
    <AdminSheetFallback
      returnPath={buildEntityEditPath('talks', talkId, {
        status: statusPrefill,
      })}
      sheet={
        <EditTalkSheetPage
          closeHref={ADMIN_LIST_PATHS.talks}
          params={params}
          searchParams={searchParams}
        />
      }
    >
      <ManageTalksPage searchParams={searchParams} />
    </AdminSheetFallback>
  );
}
