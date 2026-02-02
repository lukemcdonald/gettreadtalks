import type { TalkId } from '@/features/talks/types';

import { redirect } from 'next/navigation';

import { getFormOptions } from '@/app/@sheet/_queries/get-form-options';
import { getTalk } from '@/features/talks/queries/get-talk';
import { EditTalkSheetRoute } from './_components/edit-talk-sheet-route';

interface PageProps {
  params: Promise<{ talkId: TalkId }>;
}

export default async function Page({ params }: PageProps) {
  const { talkId } = await params;

  const [talk, { collections, speakers }] = await Promise.all([getTalk(talkId), getFormOptions()]);

  if (!talk) {
    redirect('/account/talks');
  }

  return <EditTalkSheetRoute collections={collections} speakers={speakers} talk={talk} />;
}
