import { CreateClipSheetRoute } from '@/app/@sheet/_components/create-clip-sheet-route';
import { loadFormOptions } from '@/app/@sheet/_queries/load-form-options';

interface CreateClipSheetPageProps {
  closeHref?: string;
}

export async function CreateClipSheetPage({
  closeHref,
}: CreateClipSheetPageProps = {}) {
  const { speakers, talks } = await loadFormOptions();

  return (
    <CreateClipSheetRoute
      closeHref={closeHref}
      speakers={speakers}
      talks={talks}
    />
  );
}
