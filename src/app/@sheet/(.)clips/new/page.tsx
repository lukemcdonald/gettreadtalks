import { getFormOptions } from '@/app/@sheet/_queries/get-form-options';
import { CreateClipSheetRoute } from './_components/create-clip-sheet-route';

export default async function Page() {
  const { speakers, talks } = await getFormOptions();

  return <CreateClipSheetRoute speakers={speakers} talks={talks} />;
}
