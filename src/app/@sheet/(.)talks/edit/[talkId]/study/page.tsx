import type { TalkId } from '@/features/talks/types';

import { EditTalkStudySheetPage } from '@/app/@sheet/_components/edit-talk-study-sheet-page';

interface PageProps {
  params: Promise<{ talkId: TalkId }>;
}

export default function Page({ params }: PageProps) {
  return <EditTalkStudySheetPage params={params} />;
}
