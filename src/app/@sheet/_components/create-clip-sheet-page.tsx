import { CreateClipSheetRoute } from '@/app/@sheet/(.)clips/new/_components/create-clip-sheet-route';
import { getFormOptions } from '@/app/@sheet/_queries/get-form-options';

interface CreateClipSheetPageProps {
  closeHref?: string;
}

export async function CreateClipSheetPage({
  closeHref,
}: CreateClipSheetPageProps = {}) {
  const { speakers, talks } = await getFormOptions();

  return (
    <CreateClipSheetRoute
      closeHref={closeHref}
      speakers={speakers}
      talks={talks}
    />
  );
}
