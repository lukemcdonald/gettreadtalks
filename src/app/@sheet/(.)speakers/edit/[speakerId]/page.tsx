import type { SpeakerId } from '@/features/speakers/types';

import { EditSpeakerSheetPage } from '@/app/@sheet/_components/edit-speaker-sheet-page';

interface PageProps {
  params: Promise<{ speakerId: SpeakerId }>;
}

export default function Page({ params }: PageProps) {
  return <EditSpeakerSheetPage params={params} />;
}
