import type { TalkId, TalkStudy } from '@/features/talks/types';
import type { Route } from 'next';

import { redirect } from 'next/navigation';

import { EditTalkSheetRoute } from '@/app/@sheet/_components/edit-talk-sheet-route';
import { loadFormOptions } from '@/app/@sheet/_queries/load-form-options';
import { loadTalk, loadTalkStudy } from '@/features/talks/queries/load-talk';
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

function getTalkStudyStatus(study: Pick<TalkStudy, 'studyStatus'> | null) {
  if (!study) {
    return null;
  }

  return study.studyStatus;
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
    <EditTalkSheetRoute
      closeHref={closeHref}
      collections={collections}
      speakers={speakers}
      statusPrefill={statusPrefill}
      studyStatus={getTalkStudyStatus(study)}
      talk={{
        ...talk,
        topicIds: talkTopics.map((topic) => topic._id),
      }}
      topics={topics}
    />
  );
}
