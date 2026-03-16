import { AccountCollectionsContent } from '@/app/account/collections/_components/collections-content';
import { PageHeader } from '@/components/page-header';
import { NewCollectionButton } from '@/features/collections/components/new-collection-button';

export default function AccountCollectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader description="Manage all collections" title="Manage Collections" />
        <NewCollectionButton />
      </div>
      <AccountCollectionsContent />
    </div>
  );
}
