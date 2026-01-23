import { getFormOptions } from '@/lib/sheets/queries';
import { CreateClipSheetRoute } from './_components/create-clip-sheet-route';

export default async function Page() {
  const { speakers, talks } = await getFormOptions();

  return <CreateClipSheetRoute speakers={speakers} talks={talks} />;
}
