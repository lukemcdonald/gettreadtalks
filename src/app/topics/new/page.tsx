import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import AccountTopicsPage from '@/app/account/topics/page';
import { CreateTopicSheet } from '@/features/topics/components/create-topic-sheet';
import { ADMIN_LIST_PATHS, getEntityNewPath } from '@/lib/entities/paths';

export default function Page() {
  return (
    <AdminSheetFallback
      returnPath={getEntityNewPath('topics')}
      sheet={<CreateTopicSheet closeHref={ADMIN_LIST_PATHS.topics} />}
    >
      <AccountTopicsPage />
    </AdminSheetFallback>
  );
}
