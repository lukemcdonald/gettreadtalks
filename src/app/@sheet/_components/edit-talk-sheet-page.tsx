import type { TalkId } from '@/features/talks/types';
import type { Route } from 'next';

import { redirect } from 'next/navigation';

import { EditTalkSheetRoute } from '@/app/@sheet/_components/edit-talk-sheet-route';
import { loadFormOptions } from '@/app/@sheet/_queries/load-form-options';
import { loadTalk } from '@/features/talks/queries/load-talk';
import {
  loadTalkStudy,
  loadTalkTranscript,
} from '@/features/talks/queries/load-talk-study';
import { loadTalkTopics } from '@/features/talks/queries/load-talk-topics';
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

  const [
    talk,
    talkTopics,
    study,
    transcript,
    { collections, speakers, topics },
  ] = await Promise.all([
    loadTalk(talkId),
    loadTalkTopics(talkId),
    loadTalkStudy(talkId),
    loadTalkTranscript(talkId),
    loadFormOptions(),
  ]);

  if (!talk) {
    redirect(ADMIN_LIST_PATHS.talks);
  }

  return (
    <EditTalkSheetRoute
      closeHref={closeHref}
      collections={collections}
      speakers={speakers}
      statusPrefill={statusPrefill}
      study={study}
      talk={{
        ...talk,
        topicIds: talkTopics.map((topic) => topic._id),
      }}
      topics={topics}
      transcript={transcript}
    />
  );
}
