import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui';

export function AdminTalksClient() {
  return (
    <Button render={<Link href="/talks/new" />} size="sm">
      <PlusIcon className="size-4" />
      New Talk
    </Button>
  );
}
