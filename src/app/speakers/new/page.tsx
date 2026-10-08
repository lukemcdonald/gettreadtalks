import { CreateSpeakerSheetRoute } from '@/app/@sheet/_components/create-speaker-sheet-route';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import AccountSpeakersPage from '@/app/account/speakers/page';
import { ADMIN_LIST_PATHS, getEntityNewPath } from '@/lib/entities/paths';

export default function Page() {
  return (
    <AdminSheetFallback
      returnPath={getEntityNewPath('speakers')}
      sheet={<CreateSpeakerSheetRoute closeHref={ADMIN_LIST_PATHS.speakers} />}
    >
      <AccountSpeakersPage />
    </AdminSheetFallback>
  );
}
