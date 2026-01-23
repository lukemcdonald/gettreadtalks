import type { ClipId } from '@/features/clips/types';

import { redirect } from 'next/navigation';

import { getClip } from '@/features/clips/queries';
import { getFormOptions } from '@/lib/sheets/queries';
import { EditClipSheetRoute } from './_components/edit-clip-sheet-route';

interface PageProps {
  params: Promise<{ id: ClipId }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [clip, { speakers, talks }] = await Promise.all([getClip(id), getFormOptions()]);

  if (!clip) {
    redirect('/clips');
  }

  return <EditClipSheetRoute clip={clip} speakers={speakers} talks={talks} />;
}
