import type { SpeakerId } from '@/features/speakers/types';
import type { Route } from 'next';

import { redirect } from 'next/navigation';

import { EditSpeakerSheetRoute } from '@/app/@sheet/_components/edit-speaker-sheet-route';
import { getSpeaker } from '@/features/speakers/queries/get-speaker';
import {
  ADMIN_LIST_PATHS,
  getAdminLoginRedirect,
  getEntityEditPath,
} from '@/lib/entities/paths';
import { requireAdminUser } from '@/services/auth/server';

interface EditSpeakerSheetPageProps {
  closeHref?: string;
  params: Promise<{ speakerId: SpeakerId }>;
}

export async function EditSpeakerSheetPage({
  closeHref,
  params,
}: EditSpeakerSheetPageProps) {
  const { speakerId } = await params;

  await requireAdminUser(
    getAdminLoginRedirect(getEntityEditPath('speakers', speakerId)) as Route
  );

  const speaker = await getSpeaker(speakerId);

  if (!speaker) {
    redirect(ADMIN_LIST_PATHS.speakers);
  }

  return <EditSpeakerSheetRoute closeHref={closeHref} speaker={speaker} />;
}
