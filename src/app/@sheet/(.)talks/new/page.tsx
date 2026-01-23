import { SheetScrollLock } from '@/app/@sheet/_components/sheet-scroll-lock';
import { getFormOptions } from '@/app/@sheet/_queries/get-form-options';
import { CreateTalkSheetRoute } from './_components/create-talk-sheet-route';

export default async function Page() {
  const { speakers, collections } = await getFormOptions();

  return (
    <>
      <SheetScrollLock />
      <CreateTalkSheetRoute collections={collections} speakers={speakers} />
    </>
  );
}
