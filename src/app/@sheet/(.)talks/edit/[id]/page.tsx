import type { TalkId } from '@/features/talks/types';

import { redirect } from 'next/navigation';

import { SheetScrollLock } from '@/app/@sheet/_components/sheet-scroll-lock';
import { getFormOptions } from '@/app/@sheet/_queries/get-form-options';
import { getTalk } from '@/features/talks/queries';
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

  return (
    <>
      <SheetScrollLock />
      <EditTalkSheetRoute collections={collections} speakers={speakers} talk={talk} />
    </>
  );
}
