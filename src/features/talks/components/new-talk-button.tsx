import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { buildEntityNewPath } from '@/lib/entities/paths';

export function NewTalkButton() {
  return (
    <Button
      data-testid="new-talk"
      render={<Link href={buildEntityNewPath('talks')} />}
      size="sm"
    >
      <PlusIcon className="size-4" />
      New Talk
    </Button>
  );
}
