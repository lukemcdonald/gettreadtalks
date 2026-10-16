import { CreateClipSheetPage } from '@/app/@sheet/_components/create-clip-sheet-page';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import ManageClipsPage from '@/app/manage/clips/page';
import { ADMIN_LIST_PATHS, buildEntityNewPath } from '@/lib/entities/paths';

export default function Page() {
  return (
    <AdminSheetFallback
      returnPath={buildEntityNewPath('clips')}
      sheet={<CreateClipSheetPage closeHref={ADMIN_LIST_PATHS.clips} />}
    >
      <ManageClipsPage searchParams={Promise.resolve({})} />
    </AdminSheetFallback>
  );
}
