import type { ManageListSearchParams } from '@/components/manage-table';
import type { TopicId } from '@/features/topics/types';

import { EditTopicSheetPage } from '@/app/@sheet/_components/edit-topic-sheet-page';
import { AdminSheetFallback } from '@/app/_components/admin-sheet-fallback';
import ManageTopicsPage from '@/app/manage/topics/page';
import { ADMIN_LIST_PATHS, buildEntityEditPath } from '@/lib/entities/paths';

interface PageProps {
  params: Promise<{ topicId: TopicId }>;
  searchParams: Promise<ManageListSearchParams>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { topicId } = await params;

  return (
    <AdminSheetFallback
      returnPath={buildEntityEditPath('topics', topicId)}
      sheet={
        <EditTopicSheetPage
          closeHref={ADMIN_LIST_PATHS.topics}
          params={params}
        />
      }
    >
      <ManageTopicsPage searchParams={searchParams} />
    </AdminSheetFallback>
  );
}
