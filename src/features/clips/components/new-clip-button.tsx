import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { buildEntityNewPath } from '@/lib/entities/paths';

export function NewClipButton() {
  return (
    <Button render={<Link href={buildEntityNewPath('clips')} />} size="sm">
      <PlusIcon className="size-4" />
      New Clip
    </Button>
  );
}
