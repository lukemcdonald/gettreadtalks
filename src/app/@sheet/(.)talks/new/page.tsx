import { getFormOptions } from '@/app/@sheet/_queries/get-form-options';
import { CreateTalkSheetRoute } from './_components/create-talk-sheet-route';

export default async function Page() {
  const { collections, speakers } = await getFormOptions();

  return <CreateTalkSheetRoute collections={collections} speakers={speakers} />;
}
