import type { SpeakerId } from '@/features/speakers/types';

import { redirect } from 'next/navigation';

import { getSpeakerForEdit } from '@/lib/sheets/queries';
import { EditSpeakerSheetRoute } from './_components/edit-speaker-sheet-route';

interface PageProps {
  params: Promise<{ id: SpeakerId }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const speaker = await getSpeakerForEdit(id);

  if (!speaker) {
    redirect('/speakers');
  }

  return <EditSpeakerSheetRoute speaker={speaker} />;
}
