import type { SpeakerId } from '@/features/speakers/types';
import type { Route } from 'next';

import { redirect } from 'next/navigation';

import { EditSpeakerSheetRoute } from '@/app/@sheet/_components/edit-speaker-sheet-route';
import { loadSpeaker } from '@/features/speakers/queries/load-speaker';
import {
  ADMIN_LIST_PATHS,
  getAdminLoginRedirect,
  buildEntityEditPath,
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
    getAdminLoginRedirect(buildEntityEditPath('speakers', speakerId)) as Route
  );

  const speaker = await loadSpeaker(speakerId);

  if (!speaker) {
    redirect(ADMIN_LIST_PATHS.speakers);
  }

  return <EditSpeakerSheetRoute closeHref={closeHref} speaker={speaker} />;
}
