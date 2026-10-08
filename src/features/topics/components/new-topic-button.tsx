import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui';

export function NewTopicButton() {
  return (
    <Button render={<Link href="/topics/new" />} size="sm">
      <PlusIcon className="size-4" />
      New Topic
    </Button>
  );
}
