import type { SpeakerId } from '@/features/speakers/types';

import { EditSpeakerSheetPage } from '@/app/@sheet/_components/edit-speaker-sheet-page';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import AccountSpeakersPage from '@/app/account/speakers/page';
import { ADMIN_LIST_PATHS, getEntityEditPath } from '@/lib/entities/paths';

interface PageProps {
  params: Promise<{ speakerId: SpeakerId }>;
}

export default async function Page({ params }: PageProps) {
  const { speakerId } = await params;

  return (
    <AdminSheetFallback
      returnPath={getEntityEditPath('speakers', speakerId)}
      sheet={
        <EditSpeakerSheetPage
          closeHref={ADMIN_LIST_PATHS.speakers}
          params={params}
        />
      }
    >
      <AccountSpeakersPage />
    </AdminSheetFallback>
  );
}
