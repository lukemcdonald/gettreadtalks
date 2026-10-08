import type { TalkId } from '@/features/talks/types';

import { EditTalkSheetPage } from '@/app/@sheet/_components/edit-talk-sheet-page';

interface PageProps {
  params: Promise<{ talkId: TalkId }>;
  searchParams: Promise<{ status?: string | string[] }>;
}

export default function Page({ params, searchParams }: PageProps) {
  return <EditTalkSheetPage params={params} searchParams={searchParams} />;
}
