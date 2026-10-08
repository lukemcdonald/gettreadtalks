import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui';

export function NewCollectionButton() {
  return (
    <Button render={<Link href="/collections/new" />} size="sm">
      <PlusIcon className="size-4" />
      New Collection
    </Button>
  );
}
