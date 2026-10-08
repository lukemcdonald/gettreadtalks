import { CreateClipSheetPage } from '@/app/@sheet/_components/create-clip-sheet-page';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import AccountClipsPage from '@/app/account/clips/page';
import { ADMIN_LIST_PATHS, getEntityNewPath } from '@/lib/entities/paths';

export default function Page() {
  return (
    <AdminSheetFallback
      returnPath={getEntityNewPath('clips')}
      sheet={<CreateClipSheetPage closeHref={ADMIN_LIST_PATHS.clips} />}
    >
      <AccountClipsPage searchParams={Promise.resolve({})} />
    </AdminSheetFallback>
  );
}
