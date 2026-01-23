import { SheetScrollLock } from '@/app/@sheet/_components/sheet-scroll-lock';
import { getFormOptions } from '@/app/@sheet/_queries/get-form-options';
import { CreateClipSheetRoute } from './_components/create-clip-sheet-route';

export default async function Page() {
  const { speakers, talks } = await getFormOptions();

  return (
    <>
      <SheetScrollLock />
      <CreateClipSheetRoute speakers={speakers} talks={talks} />
    </>
  );
}
