import type { SpeakerId } from '@/features/speakers/types';

import { redirect } from 'next/navigation';

import { SheetScrollLock } from '@/app/@sheet/_components/sheet-scroll-lock';
import { getSpeaker } from '@/features/speakers/queries';
import { EditSpeakerSheetRoute } from './_components/edit-speaker-sheet-route';

interface PageProps {
  params: Promise<{ id: SpeakerId }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const speaker = await getSpeaker(id);

  if (!speaker) {
    redirect('/speakers');
  }

  return (
    <>
      <SheetScrollLock />
      <EditSpeakerSheetRoute speaker={speaker} />
    </>
  );
}
