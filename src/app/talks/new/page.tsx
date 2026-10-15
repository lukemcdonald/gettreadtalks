import { CreateTalkSheetPage } from '@/app/@sheet/_components/create-talk-sheet-page';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import ManageTalksPage from '@/app/manage/talks/page';
import { ADMIN_LIST_PATHS, getEntityNewPath } from '@/lib/entities/paths';

export default function Page() {
  return (
    <AdminSheetFallback
      returnPath={getEntityNewPath('talks')}
      sheet={<CreateTalkSheetPage closeHref={ADMIN_LIST_PATHS.talks} />}
    >
      <ManageTalksPage searchParams={Promise.resolve({})} />
    </AdminSheetFallback>
  );
}
