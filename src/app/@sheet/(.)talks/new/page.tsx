import { getFormOptions } from '@/lib/sheets/queries';
import { CreateTalkSheetRoute } from './_components/create-talk-sheet-route';

export default async function Page() {
  const { speakers, collections } = await getFormOptions();

  return <CreateTalkSheetRoute collections={collections} speakers={speakers} />;
}
