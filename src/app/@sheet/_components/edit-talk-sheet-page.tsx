import type { TalkId } from '@/features/talks/types';
import type { Route } from 'next';

import { redirect } from 'next/navigation';

import { loadFormOptions } from '@/app/@sheet/_queries/load-form-options';
import { EditTalkSheet } from '@/features/talks/components/edit-talk-sheet';
import {
  loadTalk,
  loadTalkFeature,
  loadTalkTranscript,
} from '@/features/talks/queries/load-talk';
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

  const [
    talk,
    talkTopics,
    feature,
    transcript,
    { collections, speakers, topics },
  ] = await Promise.all([
    loadTalk(talkId),
    loadTalkTopics(talkId),
    loadTalkFeature(talkId),
    loadTalkTranscript(talkId),
    loadFormOptions(),
  ]);

  if (!talk) {
    redirect(ADMIN_LIST_PATHS.talks);
  }

  return (
    <EditTalkSheet
      closeHref={closeHref}
      collections={collections}
      hasTranscript={Boolean(transcript)}
      key={talk._id}
      speakers={speakers}
      statusPrefill={statusPrefill}
      studyFeature={feature}
      studyStatus={feature?.status}
      talk={{
        ...talk,
        topicIds: talkTopics.map((topic) => topic._id),
      }}
      topics={topics}
    />
  );
}
