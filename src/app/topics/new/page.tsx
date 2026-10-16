import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import ManageTopicsPage from '@/app/manage/topics/page';
import { CreateTopicSheet } from '@/features/topics/components/create-topic-sheet';
import { ADMIN_LIST_PATHS, buildEntityNewPath } from '@/lib/entities/paths';

export default function Page() {
  return (
    <AdminSheetFallback
      returnPath={buildEntityNewPath('topics')}
      sheet={<CreateTopicSheet closeHref={ADMIN_LIST_PATHS.topics} />}
    >
      <ManageTopicsPage />
    </AdminSheetFallback>
  );
}
