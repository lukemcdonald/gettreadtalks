import type { TalkId } from '@/features/talks/types';

import { redirect } from 'next/navigation';

import { getTalk } from '@/features/talks/queries';
import { getFormOptions } from '@/lib/sheets/queries';
import { EditTalkSheetRoute } from './_components/edit-talk-sheet-route';

interface PageProps {
  params: Promise<{ id: TalkId }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [talk, { speakers, collections }] = await Promise.all([getTalk(id), getFormOptions()]);

  if (!talk) {
    redirect('/account/talks');
  }

  return <EditTalkSheetRoute collections={collections} speakers={speakers} talk={talk} />;
}
