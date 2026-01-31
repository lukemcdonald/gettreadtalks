import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui';
import { Link } from '@/components/ui/link';

export function NewTalkButton() {
  return (
    <Button render={<Link href="/talks/new" prefetch="hover" />} size="sm">
      <PlusIcon className="size-4" />
      New Talk
    </Button>
  );
}
