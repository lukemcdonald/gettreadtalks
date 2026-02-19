import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui';
import { Link } from '@/components/ui/link';

export function NewCollectionButton() {
  return (
    <Button render={<Link href="/collections/new" prefetch="hover" />} size="sm">
      <PlusIcon className="size-4" />
      New Collection
    </Button>
  );
}
