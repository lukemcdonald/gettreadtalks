import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui';
import { Link } from '@/components/ui/link';

export function NewTopicButton() {
  return (
    <Button render={<Link href="/topics/new" prefetch="hover" />} size="sm">
      <PlusIcon className="size-4" />
      New Topic
    </Button>
  );
}
