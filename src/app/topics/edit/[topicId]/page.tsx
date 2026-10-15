import type { TopicId } from '@/features/topics/types';

import { EditTopicSheetPage } from '@/app/@sheet/_components/edit-topic-sheet-page';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import ManageTopicsPage from '@/app/manage/topics/page';
import { ADMIN_LIST_PATHS, getEntityEditPath } from '@/lib/entities/paths';

interface PageProps {
  params: Promise<{ topicId: TopicId }>;
}

export default async function Page({ params }: PageProps) {
  const { topicId } = await params;

  return (
    <AdminSheetFallback
      returnPath={getEntityEditPath('topics', topicId)}
      sheet={
        <EditTopicSheetPage
          closeHref={ADMIN_LIST_PATHS.topics}
          params={params}
        />
      }
    >
      <ManageTopicsPage />
    </AdminSheetFallback>
  );
}
