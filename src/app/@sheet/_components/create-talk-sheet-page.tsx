import { CreateTalkSheetRoute } from '@/app/@sheet/_components/create-talk-sheet-route';
import { loadFormOptions } from '@/app/@sheet/_queries/load-form-options';

interface CreateTalkSheetPageProps {
  closeHref?: string;
}

export async function CreateTalkSheetPage({
  closeHref,
}: CreateTalkSheetPageProps = {}) {
  const { collections, speakers, topics } = await loadFormOptions();

  return (
    <CreateTalkSheetRoute
      closeHref={closeHref}
      collections={collections}
      speakers={speakers}
      topics={topics}
    />
  );
}
