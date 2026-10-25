import type { TalkId } from '@/features/talks/types';

import { EditTalkSheetPage } from '@/app/@sheet/_components/edit-talk-sheet-page';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import ManageTalksPage from '@/app/manage/talks/page';
import { buildTalkStudyPath } from '@/features/talks/utils';
import { ADMIN_LIST_PATHS } from '@/lib/entities/paths';

export default async function Page({
  params,
}: {
  params: Promise<{ talkId: TalkId }>;
}) {
  const { talkId } = await params;

  return (
    <AdminSheetFallback
      returnPath={buildTalkStudyPath(talkId)}
      sheet={
        <EditTalkSheetPage closeHref={ADMIN_LIST_PATHS.talks} params={params} />
      }
    >
      <ManageTalksPage searchParams={Promise.resolve({})} />
    </AdminSheetFallback>
  );
}
