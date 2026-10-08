import { CreateTalkSheetRoute } from '@/app/@sheet/(.)talks/new/_components/create-talk-sheet-route';
import { getFormOptions } from '@/app/@sheet/_queries/get-form-options';

interface CreateTalkSheetPageProps {
  closeHref?: string;
}

export async function CreateTalkSheetPage({
  closeHref,
}: CreateTalkSheetPageProps = {}) {
  const { collections, speakers, topics } = await getFormOptions();

  return (
    <CreateTalkSheetRoute
      closeHref={closeHref}
      collections={collections}
      speakers={speakers}
      topics={topics}
    />
  );
}
