import { ManageTable } from '@/components/manage-table';
import { MediaHealthTableRow } from '@/features/media-health/components/media-health-table-row';
import { loadOpenMediaChecks } from '@/features/media-health/queries/load-open-media-checks';

export async function MediaHealthContent() {
  const items = await loadOpenMediaChecks();

  return (
    <ManageTable isEmpty={items.length === 0} resource="media">
      {items.map((item) => (
        <MediaHealthTableRow item={item} key={item._id} />
      ))}
    </ManageTable>
  );
}
