import type { TalkId } from '@/features/talks/types';

import { EditTalkSheetPage } from '@/app/@sheet/_components/edit-talk-sheet-page';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import AccountTalksPage from '@/app/account/talks/page';
import { ADMIN_LIST_PATHS, getEntityEditPath } from '@/lib/entities/paths';
import { parseStatusPrefill } from '@/lib/entities/status-prefill';

interface PageProps {
  params: Promise<{ talkId: TalkId }>;
  searchParams: Promise<{ status?: string | string[] }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { talkId } = await params;
  const { status } = await searchParams;

  return (
    <AdminSheetFallback
      returnPath={getEntityEditPath('talks', talkId, {
        status: parseStatusPrefill(status),
      })}
      sheet={
        <EditTalkSheetPage
          closeHref={ADMIN_LIST_PATHS.talks}
          params={params}
          searchParams={searchParams}
        />
      }
    >
      <AccountTalksPage searchParams={Promise.resolve({})} />
    </AdminSheetFallback>
  );
}
