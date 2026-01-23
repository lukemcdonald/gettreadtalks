import type { TalkId } from '@/features/talks/types';

import { redirect } from 'next/navigation';

import { getFormOptions, getTalkForEdit } from '@/lib/sheets/queries';
import { EditTalkSheetRoute } from './_components/edit-talk-sheet-route';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [talk, { speakers, collections }] = await Promise.all([
    getTalkForEdit(id as TalkId),
    getFormOptions(),
  ]);

  if (!talk) {
    redirect('/account/talks');
  }

  return <EditTalkSheetRoute collections={collections} speakers={speakers} talk={talk} />;
}
