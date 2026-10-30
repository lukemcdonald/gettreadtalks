import type { TalkId } from '@/features/talks/types';

import { EditTalkSheetPage } from '@/app/@sheet/_components/edit-talk-sheet-page';
import { ADMIN_LIST_PATHS } from '@/lib/entities/paths';

export default function Page({
  params,
}: {
  params: Promise<{ talkId: TalkId }>;
}) {
  return (
    <EditTalkSheetPage closeHref={ADMIN_LIST_PATHS.talks} params={params} />
  );
}
