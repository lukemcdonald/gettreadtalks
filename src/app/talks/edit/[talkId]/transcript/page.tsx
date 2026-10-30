import type { ManageTalksSearchParams } from '@/app/manage/talks/_components/talks-content';
import type { TalkId } from '@/features/talks/types';

import { EditTalkSheetPage } from '@/app/@sheet/_components/edit-talk-sheet-page';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import ManageTalksPage from '@/app/manage/talks/page';
import { buildTalkTranscriptPath } from '@/features/talks/utils';
import { ADMIN_LIST_PATHS } from '@/lib/entities/paths';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ talkId: TalkId }>;
  searchParams: Promise<ManageTalksSearchParams>;
}) {
  const { talkId } = await params;

  return (
    <AdminSheetFallback
      returnPath={buildTalkTranscriptPath(talkId)}
      sheet={
        <EditTalkSheetPage closeHref={ADMIN_LIST_PATHS.talks} params={params} />
      }
    >
      <ManageTalksPage searchParams={searchParams} />
    </AdminSheetFallback>
  );
}
