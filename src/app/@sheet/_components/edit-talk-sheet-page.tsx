import type { TalkId } from '@/features/talks/types';
import type { Route } from 'next';

import { redirect } from 'next/navigation';

import { loadFormOptions } from '@/app/@sheet/_queries/load-form-options';
import { EditTalkSheet } from '@/features/talks/components/edit-talk-sheet';
import { EditTalkStudySheet } from '@/features/talks/components/edit-talk-study-sheet';
import {
  loadTalk,
  loadTalkStudy,
  loadTalkTranscript,
} from '@/features/talks/queries/load-talk';
import { loadTalkTopics } from '@/features/talks/queries/load-talk-topics';
import { buildTalkStudyPath } from '@/features/talks/utils';
import {
  ADMIN_LIST_PATHS,
  buildEntityEditPath,
  getLoginRedirect,
} from '@/lib/entities/paths';
import { parseStatusPrefill } from '@/lib/entities/status-prefill';
import { requireAdminUser } from '@/services/auth/server';

interface EditTalkSheetPageProps {
  closeHref?: string;
  params: Promise<{ talkId: TalkId }>;
  searchParams?: Promise<{ status?: string | string[] }>;
}

// fallow-ignore-next-line complexity
export async function EditTalkSheetPage({
  closeHref,
  params,
  searchParams,
}: EditTalkSheetPageProps) {
  const { talkId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const status = resolvedSearchParams?.status;
  const statusPrefill = parseStatusPrefill(status);

  await requireAdminUser(
    getLoginRedirect(
      buildEntityEditPath('talks', talkId, { status: statusPrefill })
    ) as Route
  );

  const [talk, talkTopics, study, { collections, speakers, topics }] =
    await Promise.all([
      loadTalk(talkId),
      loadTalkTopics(talkId),
      loadTalkStudy(talkId),
      loadFormOptions(),
    ]);

  if (!talk) {
    redirect(ADMIN_LIST_PATHS.talks);
  }

  return (
    <EditTalkSheet
      closeHref={closeHref}
      collections={collections}
      speakers={speakers}
      statusPrefill={statusPrefill}
      studyStatus={study?.studyStatus}
      talk={{
        ...talk,
        topicIds: talkTopics.map((topic) => topic._id),
      }}
      topics={topics}
    />
  );
}

export async function EditTalkStudySheetPage({
  closeHref,
  params,
}: {
  closeHref?: string;
  params: Promise<{ talkId: TalkId }>;
}) {
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
    <EditTalkStudySheet
      closeHref={closeHref}
      study={study}
      talkId={talkId}
      transcript={transcript}
    />
  );
}
