import type { SpeakerId } from '@/features/speakers/types';

import { redirect } from 'next/navigation';

import { EditSpeakerSheetRoute } from '@/app/@sheet/(.)speakers/edit/[speakerId]/_components/edit-speaker-sheet-route';
import { getSpeaker } from '@/features/speakers/queries/get-speaker';
import { ADMIN_LIST_PATHS } from '@/lib/entities/paths';

interface EditSpeakerSheetPageProps {
  closeHref?: string;
  params: Promise<{ speakerId: SpeakerId }>;
}

export async function EditSpeakerSheetPage({
  closeHref,
  params,
}: EditSpeakerSheetPageProps) {
  const { speakerId } = await params;
  const speaker = await getSpeaker(speakerId);

  if (!speaker) {
    redirect(ADMIN_LIST_PATHS.speakers);
  }

  return <EditSpeakerSheetRoute closeHref={closeHref} speaker={speaker} />;
}
