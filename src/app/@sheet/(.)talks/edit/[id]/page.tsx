import type { TalkId } from '@/features/talks/types';

import { redirect } from 'next/navigation';

import { getFormOptions } from '@/app/@sheet/_queries/get-form-options';
import { getTalk } from '@/features/talks/queries/get-talk';
import { EditTalkSheetRoute } from './_components/edit-talk-sheet-route';

interface PageProps {
  params: Promise<{ id: TalkId }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // TODO: getFormOptions queries speakes, collections, AND talks... but we don't need talks? In other places, we need talks but maybe not speakers or collections. Would it be better to just use actions to fetch what we need or is this still the best way? Should we pass options to getFormOptions to tell it what queries to fetch?
  const [talk, { collections, speakers }] = await Promise.all([getTalk(id), getFormOptions()]);

  if (!talk) {
    redirect('/account/talks');
  }

  return <EditTalkSheetRoute collections={collections} speakers={speakers} talk={talk} />;
}
