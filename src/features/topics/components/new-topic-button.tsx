import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { buildEntityNewPath } from '@/lib/entities/paths';

export function NewTopicButton() {
  return (
    <Button render={<Link href={buildEntityNewPath('topics')} />} size="sm">
      <PlusIcon className="size-4" />
      New Topic
    </Button>
  );
}
