import type { TalkId } from '@/features/talks/types';
import type { Route } from 'next';

import { redirect } from 'next/navigation';

import { EditTalkStudySheetRoute } from '@/app/@sheet/_components/edit-talk-study-sheet-route';
import {
  loadTalk,
  loadTalkStudy,
  loadTalkTranscript,
} from '@/features/talks/queries/load-talk';
import { buildTalkStudyPath } from '@/features/talks/utils';
import { ADMIN_LIST_PATHS, getLoginRedirect } from '@/lib/entities/paths';
import { requireAdminUser } from '@/services/auth/server';

interface EditTalkStudySheetPageProps {
  closeHref?: string;
  params: Promise<{ talkId: TalkId }>;
}

export async function EditTalkStudySheetPage({
  closeHref,
  params,
}: EditTalkStudySheetPageProps) {
  const { talkId } = await params;

  await requireAdminUser(getLoginRedirect(buildTalkStudyPath(talkId)) as Route);

  const [talk, study, transcript] = await Promise.all([
    loadTalk(talkId),
    loadTalkStudy(talkId),
    loadTalkTranscript(talkId),
  ]);

  if (!talk) {
    redirect(ADMIN_LIST_PATHS.talks);
  }

  return (
    <EditTalkStudySheetRoute
      closeHref={closeHref}
      study={study}
      talkId={talkId}
      transcript={transcript}
    />
  );
}
