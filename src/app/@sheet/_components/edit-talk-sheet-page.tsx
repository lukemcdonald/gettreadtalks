import type { TalkId } from '@/features/talks/types';

import { redirect } from 'next/navigation';

import { EditTalkSheetRoute } from '@/app/@sheet/_components/edit-talk-sheet-route';
import { getFormOptions } from '@/app/@sheet/_queries/get-form-options';
import { getTalk } from '@/features/talks/queries/get-talk';
import { getTalkTopics } from '@/features/talks/queries/get-talk-topics';
import { ADMIN_LIST_PATHS } from '@/lib/entities/paths';
import { parseStatusPrefill } from '@/lib/entities/status-prefill';

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

  const [talk, talkTopics, { collections, speakers, topics }] =
    await Promise.all([
      getTalk(talkId),
      getTalkTopics(talkId),
      getFormOptions(),
    ]);

  if (!talk) {
    redirect(ADMIN_LIST_PATHS.talks);
  }

  return (
    <EditTalkSheetRoute
      closeHref={closeHref}
      collections={collections}
      speakers={speakers}
      statusPrefill={parseStatusPrefill(status)}
      talk={{
        ...talk,
        topicIds: talkTopics.map((topic) => topic._id),
      }}
      topics={topics}
    />
  );
}
